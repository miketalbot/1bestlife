const _allTasks = {}

export function typeDef(type) {
    return _allTasks[type]
}

export function registerTask(task) {
    _allTasks[task.typeId] = task
    return task
}
