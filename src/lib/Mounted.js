import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useRefresh } from './hooks'
import { Animated, Easing, View } from 'react-native'
import debounce from 'lodash-es/debounce'

let id = 0

export function useAnimatedValue(initial = 0) {
    return useRef(new Animated.Value(initial)).current
}

export function Mounted({ children, above, ...props }) {
    const [key] = useState(() => id++)
    const existing = useRef(new Map())
    const counter = useRef(new Map())
    const registerForUnmount = useCallback(
        debounce(() => {
            unmounting.current.length = 0
            refresh()
        }, 605),
        [],
    )
    const unmounting = useRef([])
    const refresh = useRefresh().debounce(50)

    const currentChildren = React.Children.toArray(children)

    let previous = new Set(existing.current.keys())

    for (let child of currentChildren) {
        previous.delete(child.key)
        if (!existing.current.has(child.key)) {
            const count = (counter.current.get(child.key) || 0) + 1
            const key = `${child.key}${count}`
            counter.current.set(child.key, count)

            existing.current.set(child.key, { child, key })
        }
    }
    for (let item of previous.values()) {
        unmounting.current.push(existing.current.get(item))
        existing.current.delete(item)
        registerForUnmount()
    }

    return (
        <View key={key}>
            {[
                ...Array.from(existing.current.values()),
                ...unmounting.current,
            ].map(({ child, key }) => (
                <Mountable
                    key={key}
                    above={above}
                    useKey={key}
                    {...props}
                    isMounted={existing.current.has(child.key)}>
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
    useKey,
    timingConfig,
    springConfig,
    style = {},
    afterMounted = { translateX: 0, opacity: 0, translateY: 0 },
    beforeMounted = { translateX: 0, opacity: 0, translateY: 400 },
}) {
    const mounted = useAnimatedValue(0)
    const wasMounted = useRef(false)
    const height = useAnimatedValue(0)
    const knownHeight = useAnimatedValue(600)
    const transition = useAnimatedValue(1)
    useEffect(() => {
        Animated.timing(transition, {
            toValue: isMounted ? 1 : 0,
            duration: 1,
            useNativeDriver: false,
        }).start(() => {
            Animated.timing(mounted, {
                toValue: isMounted ? 1 : 0,
                duration: 400,
                easing: Easing.out(Easing.sin),
                useNativeDriver: false,
            }).start()
            Animated.timing(height, {
                toValue:
                    (wasMounted.current && afterMounted.keepHeight) ||
                    (!wasMounted.current && isMounted)
                        ? 1
                        : 0,
                duration: 400,
                easing: Easing.out(Easing.sin),
                useNativeDriver: false,
            }).start()
            wasMounted.current = wasMounted.current || isMounted
        })
    }, [isMounted])

    const animatedStyle = {
        opacity: mounted,
        overflow: 'hidden',
        transform: [
            {
                translateY: Animated.multiply(
                    1,
                    mounted.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                            isMounted
                                ? beforeMounted.translateY
                                : afterMounted.translateY,
                            0,
                        ],
                    }),
                ),
            },
        ],
        maxHeight: Animated.multiply(height, knownHeight),
    }

    return (
        <Animated.View
            key={useKey}
            style={{
                ...style,
                overflow: 'hidden',
                ...animatedStyle,
            }}>
            <View onLayout={measure}>{children || null}</View>
        </Animated.View>
    )

    function measure(event) {
        const height = event.nativeEvent.layout.height
        if (height > knownHeight.value) {
            knownHeight.setValue(height)
        }
    }
}
