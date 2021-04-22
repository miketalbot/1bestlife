export function willMakeTask(task = {}) {
    task.id = task.id || task.typeId
    task.type = task.type || task.typeId || task.id
    task.id = task.id || task.type
    return function (user) {
        user.tasks.push(task)
    }
}

export function afterDelayDo(time, fn) {
    return function () {
        setTimeout(fn, time)
    }
}
