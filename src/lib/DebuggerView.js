import { useRefreshWhen } from './hooks'
import { StyleSheet, View } from 'react-native'
import { Box } from '../components/Theme'
import { Button } from 'react-native-paper'
import React from 'react'
import { raiseLater } from './local-events'

let debuggers = []

export function addDebugger(name, press, options) {
    debuggers = [
        ...debuggers.filter(d => d.name !== name),
        { name, press, ...options },
    ]
    raiseLater('debuggers-changed')
}

export function DebuggerView() {
    useRefreshWhen('debuggers-changed')
    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <View
                style={{ position: 'absolute', top: 100 }}
                pointerEvents="box-none">
                {debuggers.map((debug, index) => {
                    return (
                        <Box mt="s" ml="s" key={debug.name}>
                            <Button
                                mode="contained"
                                icon={debug.icon}
                                onPress={debug.press}>
                                {debug.name}
                            </Button>
                        </Box>
                    )
                })}
            </View>
        </View>
    )
}
