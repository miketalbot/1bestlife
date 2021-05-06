import { raiseLater } from './local-events'
import { useRefreshWhen } from './hooks'
import { getStackNavigator } from './navigation'
import React from 'react'

let screens = []
let id = 0

export const ScreenNavigatorContext = React.createContext()

export function addScreen(Component, { name = Component.name, ...props } = {}) {
    screens = [
        ...screens.filter(screen => screen.name !== name),
        { component: Wrapped, name, ...props },
    ]
    Component.navigate = function (...params) {
        getStackNavigator().navigate(name, ...params)
    }
    screens._id = id++
    raiseLater('screens-changed')
    return Component

    function Wrapped(props) {
        return (
            <ScreenNavigatorContext.Provider value={props.navigation}>
                <Component {...props} />
            </ScreenNavigatorContext.Provider>
        )
    }
}

export function useScreens() {
    useRefreshWhen('screens-changed')
    return screens
}
