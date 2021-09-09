import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useLocalEvent } from './local-events'
import { Alert } from 'react-native'
import { ScreenNavigatorContext } from './screens'
import { useRefresh } from './hooks'
import debounce from 'lodash-es/debounce'

export function useDirtyState(initial, dirty) {
    dirty = dirty || useDirty()
    const [value, setValue] = useState(initial)
    return [value, updateValue, dirty.current]

    function updateValue(newValue) {
        setValue(function (current) {
            if (typeof newValue === 'function') {
                newValue = newValue(current)
            }
            if (current !== newValue) {
                dirty.makeDirty()
            }
            return newValue
        })
    }
}

const DirtyContext = React.createContext()

function handleDirty(navigation, dirty, save) {
    return function handleDirty(e) {
        if (dirty.isDirty()) {
            e.preventDefault()
            Alert.alert(
                'Unsaved changes!',
                'You have unsaved changes. What would you like to do?',
                [
                    {
                        text: "Don't leave",
                        style: 'cancel',
                        onPress: () => {},
                    },
                    save && {
                        text: 'Save',
                        style: 'default',
                        onPress: () => {
                            save()
                        },
                    },
                    {
                        text: 'Discard',
                        style: 'destructive',
                        // If the user confirmed, then we dispatch the action we blocked earlier
                        // This will continue the action that had triggered the removal of the screen
                        onPress: () => navigation.dispatch(e.data.action),
                    },
                ].filter(Boolean),
            )
        }
    }
}

export function useDirty(parent = () => {}) {
    const context = useContext(DirtyContext)
    const dirty = useRef()
    const refresh = useRefresh()
    useEffect(() => {
        dirty.current = false
    }, [])
    let result = useMemo(
        () => ({
            Provider({ children }) {
                return (
                    <DirtyContext.Provider value={result}>
                        {children}
                    </DirtyContext.Provider>
                )
            },
            refresh: debounce(refresh),
            useAlert(save, navigation) {
                const localNavigation = useContext(ScreenNavigatorContext)
                useLocalEvent(
                    'beforeRemove',
                    handleDirty(navigation || localNavigation, result, save),
                    navigation || localNavigation,
                )
            },
            useState(initial) {
                return useDirtyState(initial, result)
            },
            clean() {
                dirty.current = false
            },
            isDirty: () => {
                return !!dirty.current
            },
            valueOf() {
                return !!dirty.current
            },
            makeDirty(fn) {
                if (!fn) {
                    updateParent()
                    dirty.current = true
                    return
                }
                return function (...params) {
                    updateParent()
                    dirty.current = true
                    console.log('::: make dirty')
                    return fn(...params)
                }
            },
        }),
        [],
    )
    return result

    function updateParent() {
        if (context) {
            context.makeDirty()
        }
        if (!parent) return
        if (typeof parent === 'function') {
            parent()
        }
        if (parent.makeDirty) {
            parent.makeDirty()
            parent.refresh()
        }
    }
}
