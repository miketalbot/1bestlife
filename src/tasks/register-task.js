import { categories } from './types/categories'

const _allTasks = {}

export function typeDef(type, defaults = { color: '#444444' }) {
    let result = _allTasks[type] || _allTasks[type.type]
    return Object.assign({}, defaults, result)
}

export function getAllTasks() {
    return _allTasks
}

export function registerTask(task) {
    task.category = task.category || categories[task.group]

    _allTasks[task.typeId] = task
    task.color = task.color || task.category?.color
    ;[task.words, task.wordOrder] = makeWordsFrom(task.title, task.keywords)
    return task
}

function makeWordsFrom(...words) {
    let keywords = words
        .flat(Infinity)
        .filter(Boolean)
        .map(w => w.split(' '))
        .flat(Infinity)
        .map(w => w.replace(/\W+/, ''))
        .filter(Boolean)
        .filter(w => w.length > 2)
        .map(w => w.toLowerCase())
    return [keywords, Object.fromEntries(keywords.map((w, i) => [w, i]))]
}
