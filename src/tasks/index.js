import './default-tasks'
import { useUser } from '../user-context'
import { raise } from '../lib/local-events'

export function useTasks() {
    const user = useUser()
    user.using(update => {
        update.tasks = update.tasks || []
        update.tasksAssigned = update.tasksAssigned || {}
        update.tasksCompleted = update.tasksCompleted || {}
    })
    raise('get-tasks', user)
    return user.tasks.filter(t => !user.tasksCompleted[t.id])
}
