import { raiseLater } from './local-events'
import { useRefreshWhen } from './hooks'
import { getStackNavigator } from './navigation'

let screens = []
let id = 0

export function addScreen(component, { name = component.name, ...props }) {
    screens = [
        ...screens.filter(screen => screen.name !== name),
        { component, name, ...props },
    ]
    component.navigate = function (...params) {
        getStackNavigator().navigate(name, ...params)
    }
    screens._id = id++
    raiseLater('screens-changed')
    return component
}

export function useScreens() {
    useRefreshWhen('screens-changed')
    return screens
}
