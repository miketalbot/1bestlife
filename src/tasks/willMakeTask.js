export function willMakeTask(task = {}) {
    task.id = task.id || task.typeId
    task.type = task.type || task.typeId || task.id
    return function (user) {
        user.tasks.push(task)
    }
}
