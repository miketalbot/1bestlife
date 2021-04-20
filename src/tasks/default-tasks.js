import React from 'react'
import { Smilie } from '../animations'
import { InputTask } from './InputTask'
import { handle } from '../lib/local-events'
import { registerTask } from './register-task'
import { StyleSheet } from 'react-native'

handle('get-tasks', applyDefaultTasks)

const styles = StyleSheet.create({
    taskImage: {
        width: 180,
    },
})

const nameTask = registerTask({
    id: 'name',
    typeId: 'name',
    title: "What's your name?",
    desc: "Let's get to know each other better, what name should I call you?",
    image: <Smilie autoPlay={true} style={styles.taskImage} />,
    type: props => <InputTask {...props} label={'Your name'} field={'name'} />,
})

function applyDefaultTasks(user) {
    user.using(update => {
        for (let task of defaultTasks) {
            if (
                update.tasksAssigned[task.id] === undefined &&
                update.tasksCompleted[task.id] === undefined
            ) {
                update.tasksAssigned[task.id] = -Date.now()
                update.tasks.push({ id: task.id, type: task.typeId })
            }
        }
    })
}

export const defaultTasks = [nameTask]
