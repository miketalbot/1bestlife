import React from 'react'
import { registerTask } from '../../register-task'
import { DoneTask } from '../../DoneTask'

registerTask({
    typeId: 'eat-fruit',
    searchable: true,
    group: 'food',
    icon: 'apple-alt',
    title: 'Eat more fruit',
    recommended: {
        count: 3,
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
        count: 3,
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
    keywords: 'meal',
    type: props => <DoneTask {...props} />,
})

registerTask({
    typeId: 'eat-lunch',
    searchable: true,
    group: 'food',
    icon: 'sandwich',
    title: 'Eat lunch',
    keywords: 'meal',
    type: props => <DoneTask {...props} />,
})

registerTask({
    typeId: 'eat-dinner',
    searchable: true,
    group: 'food',
    icon: 'utensils',
    title: 'Eat dinner',
    keywords: 'meal',
    type: props => <DoneTask {...props} />,
})
