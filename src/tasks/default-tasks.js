import React from 'react'
import { Smilie, StarStrike } from '../animations'
import { InputTask } from './InputTask'
import { handle } from '../lib/local-events'
import { registerTask } from './register-task'
import { StyleSheet } from 'react-native'
import { willMakeTask } from './willMakeTask'
import { animationWithRandomHold } from '../animations/clean'
import { DoneTask } from './DoneTask'
import { willComplete } from '../screens/completed'

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
    then: [
        willMakeTask({ type: 'greet' }),
        willComplete({ name: 'Sharing your name' }),
    ],
})

registerTask({
    id: 'greet',
    typeId: 'greet',
    image: (
        <StarStrike
            autoPlay={true}
            style={styles.taskImage}
            steps={animationWithRandomHold}
        />
    ),
    title: 'Welcome To #1 Best Life!',
    desc: [
        'Welcome to a great way to motivate and reward yourself for the progress you make toward living your best life!',
        'In #1 Best Life everything you do is about achieving your goals.',
        "Right now I've setup some immediate goals to get you ready for the important stuff.",
    ],
    type: props => <DoneTask {...props} caption={''} />,
    then: [willComplete({ name: 'Reading the introduction' })],
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
