import { StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { ensureArray } from './ensure-array'

const pressableStyles = StyleSheet.create({
    fullWidth: {
        width: '100%',
    },
})

export function FullWidthPressable({
    Component = TouchableOpacity,
    children,
    ...props
}) {
    return (
        <Component
            {...props}
            style={[...ensureArray(props.style), pressableStyles.fullWidth]}>
            {children}
        </Component>
    )
}
