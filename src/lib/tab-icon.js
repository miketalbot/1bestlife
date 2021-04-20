import Ionicons from 'react-native-vector-icons/Ionicons'
import React from 'react'

export function tabIcon(name) {
    return {
        tabBarIcon({ focused, color, size }) {
            return (
                <Ionicons
                    name={`${name}${focused ? '' : '-outline'}`}
                    size={size}
                    color={color}
                />
            )
        },
    }
}
