import React from 'react'
import { Smilie, StarStrike } from '../animations'
import { InputTask } from './InputTask'
import { handle } from '../lib/local-events'
import { registerTask } from './register-task'
import { StyleSheet } from 'react-native'
import { willMakeTask } from './willMakeTask'
import { animationWithRandomHold } from '../animations/clean'
import { DoneTask } from './DoneTask'
import { completed, willComplete } from '../screens/completed'

handle('get-tasks', applyDefaultTasks)

const styles = StyleSheet.create({
    taskImage: {
        width: '100%',
    },
})

const nameTask = registerTask({
    id: 'name',
    typeId: 'name',
    alwaysExpanded: true,
    searchable: false,
    icon: 'user',
    title: "What's your name?",
    desc: "Let's get to know each other better, what name should I call you?",
    image: <Smilie autoPlay={true} style={styles.taskImage} />,
    type: props => <InputTask {...props} label={'Your name'} field={'name'} />,
    then: [
        willMakeTask({ type: 'greet' }),
        willComplete({ name: 'Sharing your name' }),
    ],
})

setTimeout(() => {
    console.log('Cimplet')
    completed({ name: 'Test' })
}, 2000)

registerTask({
    id: 'greet',
    typeId: 'greet',
    alwaysExpanded: true,
    searchable: false,
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
    then: [
        willMakeTask({ type: 'link' }),
        willMakeTask({ type: 'link2' }),
        willComplete({ name: 'Reading the introduction' }),
    ],
})

registerTask({
    id: 'link',
    typeId: 'link',
    icon: 'at',
    searchable: false,
    color: '#ca66a1',
    title: 'Link your email',
    desc: ['You should link your email'],
    type: props => <DoneTask {...props} caption="" />,
})

registerTask({
    id: 'link2',
    icon: 'inbox',
    color: '#cb7d39',
    searchable: false,
    typeId: 'link2',
    title: 'Link your other thing',
    desc: ['You should link your thing'],
    type: props => <DoneTask {...props} caption="" />,
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
