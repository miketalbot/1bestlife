import React from 'react'
import { useUser } from '../user-context'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { typeDef } from './register-task'
import { usePalette } from '../config/palette'
import { ensureArray } from '../lib/ensure-array'

export const styles = StyleSheet.create({
    task: {
        alignItems: 'center',
    },
    title: {},
    titleText: {
        fontSize: 24,
        fontWeight: '200',
        paddingBottom: 24,
    },
    description: {
        paddingLeft: 30,
        paddingRight: 30,
    },
    descriptionText: {
        paddingBottom: 20,
        fontSize: 16,
    },
    taskControls: {},
    image: {
        width: Dimensions.get('window').width * 0.66,
    },
})

export function Task({ task, ...props }) {
    const [basic] = usePalette()
    const user = useUser()
    const taskDef = typeDef(task.type)
    if (!taskDef) {
        return null
    }
    const Type = taskDef?.type || DefaultTask
    const description = ensureArray(taskDef.desc)
    return (
        <View style={[basic.text, styles.task]}>
            <View style={[basic.text, styles.description]}>
                {description.map((desc, i) => {
                    return typeof desc === 'string' ? (
                        <Text
                            key={i}
                            style={[basic.text, styles.descriptionText]}>
                            {desc}
                        </Text>
                    ) : (
                        desc
                    )
                })}
            </View>

            <Type user={user} task={task} def={taskDef} {...props} />
        </View>
    )
}

function DefaultTask() {
    return null
}
