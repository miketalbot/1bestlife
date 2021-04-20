import React from 'react'
import { Button, TextInput } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'

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
                <Button
                    onPress={clicked}
                    disabled={value.length < minLength}
                    icon="check"
                    color="green">
                    Done
                </Button>
            </View>
        </View>
    )

    async function clicked() {
        user[field] = value
        await user.completeTask(task)
    }
}
