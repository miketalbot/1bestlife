import { StyleSheet, View } from 'react-native'
import { TickButton } from '../lib/tick-button'
import React from 'react'

const styles = StyleSheet.create({
    button: {
        alignSelf: 'center',
        padding: 16,
    },
})

export function DoneTask({ user, task, disabled }) {
    return (
        <View>
            <View style={styles.button}>
                <TickButton onPress={clicked} disabled={disabled} />
            </View>
        </View>
    )

    async function clicked() {
        await user.completeTask(task)
    }
}
