const _allTasks = {}

export function typeDef(type) {
    return _allTasks[type] || _allTasks[type.type]
}

export function registerTask(task) {
    _allTasks[task.typeId] = task
    return task
}
