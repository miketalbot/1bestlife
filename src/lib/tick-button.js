import React from 'react'
import { TouchableRipple } from 'react-native-paper'
import { Tick } from '../animations'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    button: {
        width: 80,
        height: 80,
    },
})

export function TickButton({ onPress, disabled, ...props }) {
    return (
        !disabled && (
            <TouchableRipple onPress={onPress}>
                <Tick
                    style={styles.button}
                    steps={[
                        { from: 0, to: 1 },
                        { from: 0.99, to: 1, delay: 1000 },
                        { from: 0.5, to: 1, then: 1 },
                    ]}
                    {...props}
                />
            </TouchableRipple>
        )
    )
}
