import React from 'react'
import { Icon } from './icons'

export function tabIcon(name) {
    return {
        tabBarIcon({ color, size }) {
            return <Icon name={`${name}`} size={size} color={color} />
        },
    }
}
