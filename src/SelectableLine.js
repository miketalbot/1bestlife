import LinearGradient from 'react-native-linear-gradient'
import React from 'react'
import { StyleSheet } from 'react-native'
import Color from 'color'

const styles = StyleSheet.create({
    gradientBox: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '70%',
        borderRadius: 4,
        flexGrow: 1,
    },
})

export function SelectableLine({ color, children, selected }) {
    const locations = selected ? [0.85, 0.98] : [0, 0.98]
    return (
        <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBox}
            locations={locations}
            colors={[
                `${Color(color).fade(0.5).toString()}`,
                `${Color(color).fade(1).toString()}`,
            ]}>
            {children}
        </LinearGradient>
    )
}
