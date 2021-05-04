import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { raise, useLocalEvent } from 'lib/local-events'
import { Mounted } from 'lib/Mounted'

export const OverlayContext = React.createContext()

const styles = StyleSheet.create({
    outer: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        width: '100%',
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

const mounting = {
    fromBelowBefore: { translateX: 0, opacity: 0, translateY: -250 },
    fromBelowAfter: { translateX: 0, translateY: -250, opacity: 0 },
}

export function Overlay() {
    const [[overlay, key] = [], setLocalOverlay] = useState(() => [[], 0])
    const close = useCallback(_close, [])

    useLocalEvent('set-overlay', updatedOverlay => {
        updatedOverlay.props.close = function () {
            setLocalOverlay(items => [
                items[0].filter(i => i !== updatedOverlay),
                items[1],
            ])
        }
        return setLocalOverlay(currentOverlay => [
            [...currentOverlay[0], updatedOverlay],
            currentOverlay[1],
        ])
    })
    return !overlay ? null : (
        <OverlayContext.Provider value={{ close }}>
            <View key={key} style={styles.outer}>
                <Mounted
                    beforeMounted={mounting.fromBelowBefore}
                    afterMounted={mounting.fromBelowAfter}>
                    {overlay}
                </Mounted>
            </View>
        </OverlayContext.Provider>
    )

    function _close(id, field = 'id') {
        setLocalOverlay(items => [
            items[0].filter(i => {
                i.props[field] !== id
            }),
            items[1],
        ])
    }
}
