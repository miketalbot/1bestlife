export function setFromEvent(fn) {
    return function (__, value) {
        fn(value)
    }
}
