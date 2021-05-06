import { createStackNavigator } from '@react-navigation/stack'

let stackNavigator = createStackNavigator()

export function getStackNavigator() {
    return stackNavigator
}

export function setStackNavigator(newNavigator) {
    return (stackNavigator = newNavigator)
}
