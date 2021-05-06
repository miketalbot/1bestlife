import { StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { ensureArray } from './ensure-array'
import { Box } from '../components/Theme'

const pressableStyles = StyleSheet.create({
    fullWidth: {
        flex: 1,
    },
    fullWidthPercent: {
        width: '100%',
    },
})

export function FullWidthPressable({
    Component = TouchableOpacity,
    flexDirection = 'row',
    children,
    ...props
}) {
    return (
        <Component
            {...props}
            style={[...ensureArray(props.style), pressableStyles.fullWidth]}>
            <Box flex={1} flexDirection={flexDirection}>
                {children}
            </Box>
        </Component>
    )
}

export function FullWidthByPercentPressable({
    Component = TouchableOpacity,
    flexDirection = 'row',
    children,
    ...props
}) {
    return (
        <Component
            {...props}
            style={[
                ...ensureArray(props.style),
                pressableStyles.fullWidthPercent,
            ]}>
            <Box flexGrow={1} flexDirection={flexDirection}>
                {children}
            </Box>
        </Component>
    )
}
