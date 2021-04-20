/* eslint-disable react-hooks/exhaustive-deps */
/**
 * A hook that does the equivalent of React.useState, however
 * if the component unmounts, the set function of the
 * state will be a noop.  Helps with asyncs that later try to
 * update a component that has been unmounted.
 * @param {...*} [params] - parameters passed to useState
 * @returns {Array} - the same as React useState
 */
import React, { useEffect, useRef, useState } from 'react'
import debounce from 'lodash-es/debounce'
import { handle, useLocalEvent } from './local-events'

export function noThrottle() {}

export function trackRefresh() {}

export const RefreshContext = React.createContext(false)

export function useRefreshOnEvent(event, predicate = () => true) {
    const refresh = useRefresh()
    useLocalEvent(event, (...params) => predicate(...params) && refresh())
    return refresh
}

export function boundRefresh(v) {
    if (v) {
        return (lastRefresh = v)
    } else {
        return lastRefresh
    }
}

let lastRefresh = null
let refreshId = 0

function incrementRefreshId() {
    return refreshId++
}

export function useRefreshWhen(event, ...functions) {
    const refresh = useRefresh(...functions)
    useEffect(() => {
        return handle(event, refresh)
    }, [])
    return refresh
}

export function useCurrentState(...params) {
    const [value, setValue] = useState(...params)
    let currentSetV = useRef()
    let currentGotV = useRef()
    currentSetV.current = setValue
    currentGotV.current = value
    useEffect(() => {
        return () => (currentSetV.current = null)
    }, [])
    return [
        value,
        function (...params) {
            currentSetV.current && currentSetV.current(...params)
        },
        () => currentGotV.current,
    ]
}

export function useRefresh(...functions) {
    const [, refresh, currentId] = useCurrentState(incrementRefreshId)
    const running = useRef()
    const others = useRef([])
    const isLoaded = useRef(true)
    useEffect(() => {
        return () => {
            isLoaded.current = false
        }
    }, [])

    let cachedApi = (() => {
        let api = () => {
            try {
                if (!isLoaded.current) {
                    return
                }
                if (running.current) {
                    return
                }
                functions = functions.flat(Infinity)

                running.current = !functions.includes(noThrottle)
                setTimeout(() => (running.current = false), 1)
                for (let fn of functions) {
                    try {
                        if (typeof fn === 'function') {
                            fn()
                        }
                    } catch (e) {
                        console.error(e)
                    }
                }
                const nextId = incrementRefreshId()
                refresh(nextId)
                others.current.forEach(c => c(nextId))
            } catch (e) {
                console.error(e)
            }
        }

        api.functions = functions.filter(Boolean)
        api.debounce = function (...params) {
            let debounced = debounce(api, ...params)
            debounced.functions = api.functions
            decorate(debounced)
            debounced.planRefresh = debounce(debounced.planRefresh, ...params)
            return debounced
        }
        return api
    })()
    lastRefresh = cachedApi

    function decorate(refreshFunction) {
        Object.assign(refreshFunction, {
            execute: (...params) => {
                for (let fn of [...params, ...functions].compact()) {
                    try {
                        typeof fn === 'function' && fn()
                    } catch (e) {
                        console.error(e)
                    }
                }
            },
            planRefresh: fn => {
                return (...params) => {
                    if (fn(...params) !== false) {
                        refreshFunction()
                    }
                }
            },
            always: () => {
                refreshFunction.id = refreshId++
                refreshFunction()
            },
            useRefresh: () => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const [, setValue] = useState(0)
                // eslint-disable-next-line react-hooks/rules-of-hooks
                useEffect(() => {
                    others.current.push(setValue)
                    return () => {
                        others.current = others.current.filter(
                            f => f !== setValue,
                        )
                    }
                })
            },
        })

        refreshFunction.id = currentId()
        return refreshFunction
    }

    return decorate(cachedApi)
}
