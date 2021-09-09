import React from 'react'
import { registerTask } from '../../register-task'
import { DoneTask } from '../../DoneTask'

registerTask({
    typeId: 'eat-fruit',
    searchable: true,
    group: 'food',
    icon: 'apple-alt',
    title: 'Eat more fruit',
    dayTimes: 3,
    recommended: {
        dayTimes: 3,
        type: 'daily',
    },
    keywords: 'health five a day',
    type: props => <DoneTask {...props} />,
})

registerTask({
    typeId: 'eat-veg',
    searchable: true,
    group: 'food',
    icon: 'carrot',
    title: 'Eat more vegetables',
    recommended: {
        dayTimes: 3,
        type: 'daily',
    },
    keywords: 'health five a day',
    type: props => <DoneTask {...props} />,
})

registerTask({
    typeId: 'eat-breakfast',
    searchable: true,
    group: 'food',
    icon: 'egg-fried',
    title: 'Eat breakfast',
    recommended: {
        dayTimes: 1,
        type: 'daily',
    },
    keywords: 'meal',
    type: props => <DoneTask {...props} />,
})

registerTask({
    typeId: 'eat-lunch',
    searchable: true,
    group: 'food',
    icon: 'sandwich',
    recommended: {
        dayTimes: 1,
        type: 'daily',
    },
    title: 'Eat lunch',
    keywords: 'meal',
    type: props => <DoneTask {...props} />,
})

registerTask({
    typeId: 'eat-dinner',
    searchable: true,
    group: 'food',
    icon: 'utensils',
    recommended: {
        dayTimes: 1,
        type: 'daily',
    },
    title: 'Eat dinner',
    keywords: 'meal',
    type: props => <DoneTask {...props} />,
})
