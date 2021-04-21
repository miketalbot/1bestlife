import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { raise, useLocalEvent } from './lib/local-events'

const styles = StyleSheet.create({
    outer: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
    },
    smiler: {
        width: '100%',
        height: '100%',
        backgroundColor: '#000A',
    },
})

export function setOverlay(overlay) {
    raise('set-overlay', overlay)
}

export function Overlay() {
    const [[overlay, key] = [], setLocalOverlay] = useState(() => [null, 0])

    useLocalEvent('set-overlay', updatedOverlay =>
        setLocalOverlay([updatedOverlay, Date.now()]),
    )
    return !overlay ? null : (
        <View key={key} style={styles.outer}>
            {overlay}
        </View>
    )
}
