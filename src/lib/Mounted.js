import React, { useCallback, useEffect, useRef, useState } from 'react'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated'
import { useRefresh } from './hooks'
import { View } from 'react-native'
import debounce from 'lodash-es/debounce'
import { lerp } from './lerp'

let id = 0

export function Mounted({ children, above, ...props }) {
    const [key] = useState(() => id++)
    const existing = useRef(new Map())
    const counter = useRef(new Map())
    const mounting = useRef(new Map())
    const registerForUnmount = useCallback(
        debounce(() => {
            let shouldRefresh = false
            for (let item of toBeUnmounted.current.values()) {
                if (unmounting.current.has(item)) {
                    unmounting.current.delete(item)
                    shouldRefresh = true
                }
            }
            toBeUnmounted.current.clear()
            if (shouldRefresh) refresh()
        }, 605),
        [],
    )
    const unmounting = useRef(new Map())
    const toBeUnmounted = useRef(new Set())
    const refresh = useRefresh().debounce(50)
    const currentChildren = React.Children.toArray(children)
    let previous = new Set(existing.current.keys())
    for (let child of currentChildren) {
        previous.delete(child.key)
        if (
            !existing.current.has(child.key) &&
            !unmounting.current.has(child.key)
        ) {
            toBeUnmounted.current.delete(child)
            const count = (counter.current.get(child.key) || 0) + 1
            const key = `${child.key}${count}`
            counter.current.set(child.key, count)
            existing.current.set(child.key, { child, key })
            mounting.current.set(child.key, { child, key })
        }
    }
    for (let item of previous.values()) {
        mounting.current.delete(item)
        if (unmounting.current.has(item)) {
            continue
        }
        unmounting.current.set(item, existing.current.get(item))
        existing.current.delete(item)
        toBeUnmounted.current.add(item)
        registerForUnmount()
    }

    return (
        <View key={key}>
            {[
                ...Array.from(mounting.current.values()),
                ...Array.from(unmounting.current.values()),
            ].map(({ child, key }) => (
                <Mountable
                    above={above}
                    {...props}
                    isMounted={mounting.current.has(child.key)}>
                    {child}
                </Mountable>
            ))}
        </View>
    )
}

const styles = {
    fromAboveBefore: { translateX: 0, opacity: 0, translateY: -250 },
    fromAboveAfter: { translateX: 0, translateY: -250, opacity: 0 },
}

function Mountable({ above, ...props }) {
    return !above ? (
        <BelowMountable {...props} />
    ) : (
        <BelowMountable
            beforeMounted={styles.fromAboveBefore}
            afterMounted={styles.fromAboveAfter}
            {...props}
        />
    )
}

function BelowMountable({
    children,
    isMounted,
    timingConfig,
    springConfig,
    style = {},
    afterMounted = { translateX: 0, opacity: 0, translateY: 0 },
    beforeMounted = { translateX: 0, opacity: 0, translateY: 400 },
}) {
    const viewHeight = useSharedValue(0)
    const mounted = useSharedValue(0)
    const wasMounted = useSharedValue(false)
    const measure = useCallback(_measure, [isMounted])
    const hasMounted = useRef(false)
    const capturedHeight = useSharedValue(0)

    useEffect(() => {
        if (!isMounted) {
            wasMounted.value = wasMounted.value || hasMounted.current
        }
        mounted.value = isMounted ? withTiming(1) : withTiming(0)
        hasMounted.current = hasMounted.current || isMounted
    }, [isMounted])

    const animatedStyles = useAnimatedStyle(() => {
        const translateX = lerp(
            wasMounted.value
                ? beforeMounted.translateX
                : afterMounted.translateX,
            0,
            mounted.value,
        )
        const translateY = lerp(
            wasMounted.value
                ? beforeMounted.translateY
                : afterMounted.translateY,
            0,
            mounted.value,
        )
        if (mounted.value > 0.9999) {
            capturedHeight.value = viewHeight.value
        }
        return {
            transform: [{ translateX: translateX }, { translateY: translateY }],
            opacity: mounted.value,
            overflow: 'hidden',

            maxHeight: lerp(0, 600, mounted.value),
            // height: mounted.value ? undefined : viewHeight.value,
        }
    })
    return (
        <Animated.View style={[style, animatedStyles]}>
            <View onLayout={measure}>{children || null}</View>
        </Animated.View>
    )
    function _measure(event) {
        viewHeight.value = Math.floor(event.nativeEvent.layout.height)
    }
}
