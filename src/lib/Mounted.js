import React, { useEffect, useRef, useState } from 'react'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated'
import { useRefresh } from './hooks'
import { View } from 'react-native'

let id = 0

export function Mounted({ children, above, ...props }) {
    const [key] = useState(() => id++)
    const existing = useRef(new Map())
    const counter = useRef(new Map())
    const mounting = useRef(new Map())
    const unmounting = useRef(new Map())
    const refresh = useRefresh()
    const currentChildren = React.Children.toArray(children)
    let previous = new Set(existing.current.keys())
    for (let child of currentChildren) {
        previous.delete(child.key)
        if (!existing.current.has(child.key)) {
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
        setTimeout(() => {
            if (unmounting.current.has(item)) {
                unmounting.current.delete(item)
                refresh()
            }
        }, 750)
    }

    return (
        <View key={key}>
            {[
                ...Array.from(mounting.current.values()).map(
                    ({ child, key }) => (
                        <Mountable
                            above={above}
                            {...props}
                            key={key}
                            isMounted={true}>
                            {child}
                        </Mountable>
                    ),
                ),
                ...Array.from(unmounting.current.values()).map(
                    ({ child, key }) => (
                        <Mountable
                            above={above}
                            {...props}
                            key={key}
                            isMounted={false}>
                            {child}
                        </Mountable>
                    ),
                ),
            ]}
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
    const wasMounted = useRef(false)
    const mounted = useSharedValue()
    mounted.value = isMounted
    const viewHeight = useSharedValue()
    const maxHeight = useSharedValue(0)
    const measuredHeight = useRef()
    useEffect(() => {
        if (!isMounted) {
            viewHeight.value = measuredHeight.current
            setTimeout(() => {
                viewHeight.value = withTiming(0)
            }, 0)
            wasMounted.current = false
        } else {
            maxHeight.value = 0
            viewHeight.value = 500
            setTimeout(() => {
                maxHeight.value = withTiming(600)
            }, 0)
        }
    }, [isMounted, viewHeight, maxHeight])
    const animatedStyles = useAnimatedStyle(() => {
        const fromStyle = beforeMounted || afterMounted
        let translateX
        let translateY
        let opacity
        if (isMounted) {
            if (!wasMounted.current) {
                translateX = fromStyle.translateX
                translateY = fromStyle.translateY
                opacity = fromStyle.opacity
                wasMounted.current = true
            } else {
                translateY = withSpring(0, springConfig)
                translateX = withSpring(0, springConfig)
                opacity = withTiming(1, timingConfig)
            }
        } else {
            translateX = withSpring(afterMounted.translateX, springConfig)
            translateY = withSpring(afterMounted.translateY, springConfig)
            opacity = withTiming(afterMounted.opacity, timingConfig)
        }

        return {
            transform: [
                {
                    translateX,
                },
                {
                    translateY,
                },
            ],
            opacity,
            height: mounted.value ? undefined : viewHeight.value,
            maxHeight: maxHeight.value,
        }
    })
    return (
        <Animated.View style={[style, animatedStyles]}>
            <View onLayout={measure}>{children || null}</View>
        </Animated.View>
    )
    function measure(event) {
        measuredHeight.current = event.nativeEvent.layout.height
    }
}
