export function lerp(start, end, value) {
    'worklet'
    value = Math.min(1, Math.max(0, value))
    return (end - start) * value + start
}
