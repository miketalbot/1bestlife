const _allTasks = {}

export function typeDef(type, defaults = { color: '#444444' }) {
    let result = _allTasks[type] || _allTasks[type.type]
    return Object.assign({}, defaults, result)
}

export function registerTask(task) {
    _allTasks[task.typeId] = task
    return task
}
