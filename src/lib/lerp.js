export function lerp(start, end, value) {
    'worklet'
    return (end - start) * value + start
}
