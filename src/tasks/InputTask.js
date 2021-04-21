import React from 'react'
import { TextInput } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'
import { TickButton } from '../lib/tick-button'

const styles = StyleSheet.create({
    input: {
        alignSelf: 'stretch',
    },
})

export function InputTask({
    label,
    minLength = 2,
    user,
    task,
    field,
    defaultValue = '',
    ...props
}) {
    const [value, setValue] = React.useState(defaultValue)
    return (
        <View style={{ alignSelf: 'stretch' }}>
            <View
                style={{
                    padding: 16,
                    alignSelf: 'stretch',
                }}>
                <TextInput
                    style={styles.input}
                    label={label}
                    value={value}
                    onChangeText={setValue}
                    {...props}
                />
            </View>
            <View style={{ alignSelf: 'center', padding: 16 }}>
                <TickButton
                    onPress={clicked}
                    disabled={value.length < minLength}
                />
            </View>
        </View>
    )

    async function clicked() {
        user[field] = value
        await user.completeTask(task)
    }
}
