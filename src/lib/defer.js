export function Defer() {
    let prResolve, prReject
    let promise = new Promise(function (resolve, reject) {
        prResolve = resolve
        prReject = reject
    })
    Object.defineProperties(promise, {
        resolve: {
            get: () => prResolve,
        },
        reject: {
            get: () => prReject,
        },
    })
    return promise
}

export function defer(fn) {
    return (...params) => setTimeout(() => fn(...params))
}
