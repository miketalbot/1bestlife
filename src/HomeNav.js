import { SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { usePalette } from './config/palette'
import { useTasks } from './tasks'
import { Task } from './tasks/task'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated'
import { useRefresh } from './lib/hooks'

const Stack = createStackNavigator()

export function HomeNav() {
    return (
        <Stack.Navigator initialRouteName={'Home'}>
            <Stack.Screen name={'Home'} component={Home} />
        </Stack.Navigator>
    )
}

function Home() {
    const [styles, isDarkMode] = usePalette()
    const tasks = useTasks()
    const highPriority =
        tasks.length === 1 ? tasks[0] : tasks.find(t => t.priority === 'high')
    return (
        <SafeAreaView style={styles.text}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={styles.text}>
                <View style={styles.text}>
                    <View>
                        <Text style={styles.title}>Welcome!</Text>
                    </View>
                </View>
                <Mounted>
                    {highPriority && <Task task={highPriority} />}
                </Mounted>
                <Text style={styles.title}>I'm here</Text>
            </ScrollView>
        </SafeAreaView>
    )
}

function Mounted({ children, ...props }) {
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
        }, 2000)
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
    const refresh = useRefresh()
    const viewHeight = useSharedValue(undefined)
    const maxHeight = useRef()
    useEffect(() => {
        if (!isMounted) {
            viewHeight.value = withTiming(0)
        } else {
            viewHeight.value = undefined
        }
    }, [isMounted, viewHeight])
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
            height: viewHeight.value,
        }
    })
    return (
        <Animated.View style={[style, animatedStyles]}>
            <View onLayout={logIt}>{children || null}</View>
        </Animated.View>
    )
    function logIt(event) {
        viewHeight.value = event.nativeEvent.layout.height
        maxHeight.current = event.nativeEvent.layout.height
        refresh()
    }
}
