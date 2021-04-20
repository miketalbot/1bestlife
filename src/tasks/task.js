import React from 'react'
import { useUser } from '../user-context'
import { StyleSheet, Text, View } from 'react-native'
import { typeDef } from './register-task'
import { usePalette } from '../config/palette'

export const styles = StyleSheet.create({
    task: {
        alignItems: 'center',
    },
    title: {},
    titleText: {
        fontSize: 24,
        fontWeight: '500',
        paddingBottom: 24,
    },
    description: {
        paddingLeft: 30,
        paddingRight: 30,
    },
    descriptionText: {},
    taskControls: {},
})

export function Task({ task, ...props }) {
    const [basic] = usePalette()
    const user = useUser()
    const taskDef = typeDef(task.type)
    if (!taskDef) {
        return null
    }
    const Type = taskDef?.type || DefaultTask
    return (
        <View style={[basic.text, styles.task]}>
            {taskDef.image}
            <View style={styles.title}>
                <Text style={[basic.text, styles.titleText]}>
                    {taskDef.title}
                </Text>
            </View>
            <View style={[basic.text, styles.description]}>
                <Text style={[basic.text, styles.descriptionText]}>
                    {taskDef.desc}
                </Text>
            </View>

            <Type user={user} task={task} def={taskDef} {...props} />
        </View>
    )
}

function DefaultTask() {
    return null
}
