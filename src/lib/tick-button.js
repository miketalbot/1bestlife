import React, { useMemo, useRef } from 'react'
import { Tick } from '../animations'
import { StyleSheet, TouchableOpacity } from 'react-native'

const styles = StyleSheet.create({
    button: {
        width: 80,
        height: 80,
    },
})

export function TickButton({ onPress, disabled, style }) {
    const wasEnabled = useRef()
    wasEnabled.current = wasEnabled.current || !disabled
    const content = useMemo(() => {
        return !disabled ? (
            <Tick
                style={[styles.button, style]}
                steps={[
                    { from: 0, to: 1 },
                    { from: 0.99, to: 1, delay: 1000 },
                    { from: 0.5, to: 1, then: 1 },
                ]}
            />
        ) : (
            wasEnabled.current && (
                <Tick
                    style={[styles.button, style]}
                    steps={[{ from: 0.3, to: 0 }]}
                />
            )
        )
    }, [disabled, style])
    return (
        <TouchableOpacity onPress={() => !disabled && onPress()}>
            {content}
        </TouchableOpacity>
    )
}
