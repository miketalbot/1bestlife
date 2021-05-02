import { registerTask } from '../../register-task'
import { DoneTask } from '../../DoneTask'
import React from 'react'

registerTask({
    typeId: 'brush-hair',
    searchable: true,
    group: 'hygiene',
    icon: 'user-check',
    title: 'Brush your hair',
    type: props => <DoneTask {...props} />,
})

registerTask({
    typeId: 'brush-teeth',
    group: 'hygiene',
    searchable: true,
    icon: 'toothbrush',
    title: 'Brush your teeth',
    keywords: 'wash tooth',
    type: props => <DoneTask {...props} />,
})

registerTask({
    typeId: 'wash-hair',
    group: 'hygiene',
    searchable: true,
    icon: 'soap',
    title: 'Wash your hair',
    type: props => <DoneTask {...props} />,
})

registerTask({
    typeId: 'take-shower',
    group: 'hygiene',
    searchable: true,
    icon: 'shower',
    title: 'Have a shower',
    keywords: 'wash bath',
    type: props => <DoneTask {...props} />,
})

registerTask({
    typeId: 'take-bath',
    group: 'hygiene',
    searchable: true,
    icon: 'bath',
    title: 'Have a bath',
    keywords: 'wash relax shower',
    type: props => <DoneTask {...props} />,
})

registerTask({
    typeId: 'wash-hands',
    group: 'hygiene',
    searchable: true,
    icon: 'hands-wash',
    title: 'Wash your hands',
    keywords: 'health',
    type: props => <DoneTask {...props} />,
})
