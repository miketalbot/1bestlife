let promiseId = 1
const map = {}
const storage = {}

function getCurrent() {
    return storage.current
}

export function getContext() {
    return [storage.chainId, storage.current]
}

export function getContextSize() {
    return Object.keys(map).length
}

/**
 * The current context, use it by setting and
 * retrieving variables like it was an empty object.
 * If there is no context, the values set will be lost
 * @example
 *
 * const myFunction = withContext(function () {
 *      cls.something = "good"
 *
 *      setTimeout(()=>{
 *          console.log(cls.something) // => good
 *      }, 10000)
 * })
 *
 */
export const cls = new Proxy(getCurrent, {
    get(obj, prop) {
        if (storage.current) {
            return storage.current[prop]
        }
    },
    set(obj, prop, value) {
        if (storage.current) {
            storage.current[prop] = value
        }
        return true
    },
    has(obj, prop) {
        return prop in storage.current
    },
})

/**
 * Wrap a function so that it will be called with context.
 * Note that if the context has expired then the variables will be
 * lost, this function does not keep context alive.
 * @param {Function} executor - the function to execute
 * @param [_chainId] - internal use only
 * @returns {Function} the function to be called to wrap the executor in the context
 * @example
 * reader.onLoad(wrapInContext(()=>{
 *     console.log(cls.something)
 * }))
 */
export function wrapInContext(executor, _chainId = cls.chainId) {
    executor = internalWithContext(executor, _chainId)
    return function (...params) {
        const oldChainId = storage.chainId
        const oldStorage = storage.current
        try {
            storage.chainId = _chainId
            storage.current = map[_chainId] = map[_chainId] || {}
            return executor(...params)
        } finally {
            storage.chainId = oldChainId
            storage.current = oldStorage
        }
    }
}

const timers = {}

const _setTimeout = window.setTimeout

function mySetTimeout(fn, time) {
    const chainId = storage.chainId || promiseId++
    storage.current = map[chainId] = map[chainId] || {}
    storage.current._count = (storage.current._count || 0) + 1
    let timerId = _setTimeout(
        decrement(
            wrapInContext(fn, chainId),
            chainId,
            () => delete timers[timerId],
        ),
        time,
    )
    timers[timerId] = chainId
    return timerId
}

const _clearTimeout = window.clearTimeout

function myClearTimeout(timerId) {
    _clearTimeout(timerId)
    const chainId = timers[timerId]
    if (chainId && map[chainId] && map[chainId]._count) {
        let count = (map[chainId]._count = map[chainId]._count - 1)
        if (!count) {
            delete map[chainId]
        }
        delete timers[timerId]
    }
}

window.clearTimeout = myClearTimeout

export function decrement(fn, chainId, then) {
    fn = internalWithContext(fn, chainId)
    return function (value) {
        try {
            return fn(value)
        } finally {
            let count = (map[chainId]._count = map[chainId]._count - 1)
            if (!count) {
                delete map[chainId]
            }
            if (then) {
                then()
            }
        }
    }
}

function resolver(fn, chainId) {
    return (resolve, reject) => {
        const oldChainId = storage.chainId
        storage.current = map[chainId] = map[chainId] || {}
        storage.chainId = chainId
        let result = fn(decrement(resolve, chainId), decrement(reject, chainId))
        storage.chainId = oldChainId
        return result
    }
}

const RealPromise = window.Promise

class MyPromise extends RealPromise {
    constructor(executor) {
        const chainId = storage.chainId || promiseId++
        storage.current = map[chainId] = map[chainId] || {}
        storage.current._count = (storage.current._count || 0) + 1
        const fn = resolver(executor, chainId)
        const result = super(fn)
        const _then = this.then.bind(this)
        const _catch = this.catch.bind(this)
        const _finally = this.finally.bind(this)

        this.then = (fn1, fn2) =>
            _then(wrapInContext(fn1, chainId), wrapInContext(fn2, chainId))
        this.catch = fn => _catch(wrapInContext(fn, chainId))
        this.finally = fn => _finally(wrapInContext(fn, chainId))
        return result
    }
}

export function internalWithContext(fn, chainId) {
    return function (...params) {
        const oldChainId = storage.chainId
        const oldStorage = storage.current
        storage.chainId = chainId
        storage.current = map[chainId] = map[chainId] || {}
        const FormerPromise = window.Promise
        const formerTimeout = window.setTimeout
        window.Promise = MyPromise
        window.setTimeout = mySetTimeout
        try {
            return fn(...params)
        } finally {
            storage.chainId = oldChainId
            storage.current = oldStorage
            window.Promise = FormerPromise
            window.setTimeout = formerTimeout
        }
    }
}

/**
 * Declares a function that starts a context chain, promises
 * and timeouts made by this function can access cls.
 * Will reuse rather than inherit the current context if
 * one exists. Should be used at
 * the top level.
 * @param {function} fn - the function to execute
 * @returns {function} the wrapped function
 */
export function createContext(fn) {
    return function (...params) {
        const chainId = storage.chainId || promiseId++
        map[chainId] = map[chainId] || {}
        map[chainId]._count = (map[chainId]._count || 0) + 1
        const toCall = decrement(fn, chainId)
        return toCall(...params)
    }
}

/**
 * Creates a context that inherits from any current context,
 * all functions will get the current values but have a
 * different context for writing from each other
 * @param {Function} fn - the function to wrap
 * @returns {Function} the wrapped function
 */
export function withContext(fn) {
    let parentId = storage.chainId
    let parent = storage.current
    return function (...params) {
        const chainId = promiseId++
        if (parentId) {
            map[chainId] = Object.create(parent)
        } else {
            map[chainId] = {}
        }
        map[chainId]._count = 1
        const toCall = decrement(fn, chainId)
        return toCall(...params)
    }
}

export function createNewContext() {
    const chainId = promiseId++
    map[chainId] = {}
    map[chainId]._count = 1
    return [chainId, map[chainId]]
}
