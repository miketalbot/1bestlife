import React, { useEffect, useMemo, useState } from 'react'
import LottieView from 'lottie-react-native'
import { Animated, Dimensions, Easing } from 'react-native'
import { Defer } from '../lib/defer'
import { resolveAsFunction } from '../lib/resolve-as-function'

export function clean(item) {
    for (let [key, value] of Object.entries(item)) {
        if (key === 'bm' && value > 15) {
            item.bm = 0
        } else if (Array.isArray(value)) {
            let remove = []
            for (let subItem of value) {
                if (subItem?.ty === 'op') {
                    remove.push(subItem)
                    continue
                }
                clean(subItem)
            }
            for (let del of remove) {
                value.splice(value.indexOf(del), 1)
            }
        } else if (typeof value === 'object' && value) {
            clean(value)
        }
    }
    return item
}

export function Lottie({
    source,
    autoPlay,
    loop,
    width,
    height,
    style,
    steps = [{ from: 0, to: 1 }],
    ...props
}) {
    const additiveStyles = useMemo(() => {
        let dimensionStyle = {}
        if (width < 1) {
            dimensionStyle.width = Math.floor(
                Dimensions.get('window').width * width,
            )
        } else if (width) {
            dimensionStyle.width = width
        }
        if (height < 1) {
            dimensionStyle.height = Math.floor(
                Dimensions.get('window').height * height,
            )
        } else if (width) {
            dimensionStyle.height = height
        }
        return dimensionStyle
    }, [width, height])
    const [progress] = useState(new Animated.Value(0))
    useEffect(() => {
        let terminated = false
        ;(async () => {
            let totalDuration = (source.op - source.ip) / source.fr

            let promise
            do {
                if (terminated) {
                    break
                }
                for (let i = 0; i < steps.length; i++) {
                    let step = steps[i]
                    await animateTo(step.from, step.to, step.delay)
                    if (terminated) {
                        break
                    }
                    if (step.then) {
                        i = step.then - 1
                    }
                }
            } while (loop)
            function animateTo(from = 0, to = 1, delay = 0) {
                progress.setValue(from)
                promise = Defer()
                let duration = Math.floor(
                    1000 * (Math.abs(to - from) * totalDuration),
                )
                Animated.timing(progress, {
                    duration,
                    toValue: to,
                    easing: Easing.linear,
                    delay: resolveAsFunction(delay)(),
                    useNativeDriver: true,
                    isInteraction: false,
                }).start(promise.resolve)

                return promise
            }
        })()
        return () => (terminated = true)
    }, [loop, progress, source, steps])
    return (
        <LottieView
            style={[style, additiveStyles]}
            progress={progress}
            source={clean(source)}
            {...props}
        />
    )
}

export const animationWithRandomHold = [
    { from: 0, to: 1 },
    { from: 0.99, to: 1, delay: () => 1000 + Math.random() * 8000 },
]
