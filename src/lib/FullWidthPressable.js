import { StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'

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
        <Component style={pressableStyles.fullWidth} {...props}>
            {children}
        </Component>
    )
}
