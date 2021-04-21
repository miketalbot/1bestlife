import React, { useEffect, useRef } from 'react'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated'
import { useRefresh } from '../src/lib/hooks'
import { View } from 'react-native'

export function Mounted({ children, ...props }) {
    const existing = useRef(new Map())
    const mounting = useRef(new Map())
    const unmounting = useRef(new Map())
    const refresh = useRefresh()
    const currentChildren = React.Children.toArray(children)
    let previous = new Set(existing.current.keys())
    for (let child of currentChildren) {
        previous.delete(child.key)
        if (unmounting.current.has(child.key)) {
            mounting.current.set(child.key, child)
            unmounting.current.delete(child.key)
        }
        if (!existing.current.has(child.key)) {
            existing.current.set(child.key, child)
            mounting.current.set(child.key, child)
        }
    }
    for (let item of previous.values()) {
        if (unmounting.current.has(item)) {
            continue
        }
        mounting.current.delete(item)
        unmounting.current.set(item, existing.current.get(item))
        setTimeout(() => {
            if (unmounting.current.has(item)) {
                console.log('LOG>> remove', item)
                unmounting.current.delete(item)
                existing.current.delete(item)
                refresh()
            }
        }, 1000)
    }

    let list = [
        ...Array.from(mounting.current.values()).map(child => (
            <Mountable {...props} key={child.key} isMounted={true}>
                {child}
            </Mountable>
        )),
        ...Array.from(unmounting.current.values()).map(child => (
            <Mountable {...props} key={child.key} isMounted={false}>
                {child}
            </Mountable>
        )),
    ]
    console.log('LOG>>', list.length)
    return list
}

function Mountable({
    children,
    isMounted,
    style = {},
    unMountedStyle = { translateX: -200, opacity: 0, translateY: 0 },
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
            }, 50)
            wasMounted.current = false
        } else {
            maxHeight.value = 0
            viewHeight.value = 500
            setTimeout(() => {
                maxHeight.value = withTiming(1000)
            }, 100)
        }
    }, [isMounted, viewHeight, maxHeight])
    const animatedStyles = useAnimatedStyle(() => {
        const fromStyle = beforeMounted || unMountedStyle
        let translateX
        let translateY
        let opacity
        let height
        if (isMounted) {
            if (!wasMounted.current) {
                translateX = fromStyle.translateX
                translateY = fromStyle.translateY
                opacity = fromStyle.opacity
                wasMounted.current = true
            } else {
                translateY = withSpring(0)
                translateX = withSpring(0)
                opacity = withSpring(1)
            }
        } else {
            translateX = withSpring(unMountedStyle.translateX)
            translateY = withSpring(unMountedStyle.translateY)
            opacity = withSpring(unMountedStyle.opacity)
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
            <View onLayout={logIt}>{children || null}</View>
        </Animated.View>
    )
    function logIt(event) {
        measuredHeight.current = event.nativeEvent.layout.height
    }
}
