import React, { useEffect, useState } from 'react'
import {
    createNewContext,
    decrement,
    internalWithContext,
    withContext,
} from './cls'

export function useCallbackWithInheritedContext(callback, deps) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return React.useCallback(withContext(callback), deps)
}

export function componentWithContext(fn) {
    return function (...params) {
        const [[chainId]] = useState(() => {
            return createNewContext()
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const toCall = React.useCallback(internalWithContext(fn, chainId), [
            chainId,
        ])
        useEffect(() => {
            return decrement(() => {}, chainId)
        }, [chainId])

        return toCall(...params)
    }
}
