export function resolveAsFunction(value) {
    if (typeof value === 'function') {
        return value
    }
    return () => value
}
