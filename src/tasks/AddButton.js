import React, { useContext, useMemo, useRef, useState } from 'react'
import { Dimensions, Pressable, StyleSheet, View } from 'react-native'
import { Icon } from '../lib/icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { palette } from '../config/palette'
import Svg, { Defs, Mask, Path, Rect } from 'react-native-svg'
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedProps,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated'
import { mix } from 'react-native-redash'
import { Text } from '../components/Theme'
import { getStackNavigator } from '../lib/navigation'

const styles = StyleSheet.create({
    add: {
        ...StyleSheet.absoluteFillObject,
        top: Dimensions.get('window').height - 80,
    },
    icon: {
        borderRadius: 24,
        width: 48,
        height: 48,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        marginBottom: 8,
    },
    spacer: {
        height: 16,
    },
    flexGrow: {
        flexGrow: 1,
    },
})

const AnimatedRect = Animated.createAnimatedComponent(Rect)
const CloseContext = React.createContext()

function MenuItem({ icon, text, type, ...props }) {
    const close = useContext(CloseContext)
    const navigate = getStackNavigator()
    return (
        <Pressable onPress={select}>
            <View style={styles.menuItem}>
                <View style={styles.icon}>
                    <Icon icon={icon} />
                </View>
                <Text variant="button" color="textContrast">
                    {text}
                </Text>
                <View style={styles.flexGrow} />
                <Icon size={12} icon="chevron-right" />
            </View>
        </Pressable>
    )
    function select() {
        setTimeout(() => close(), 750)
        navigate.navigate('Set A NewTask', { type, title: `${text}`, ...props })
    }
}

const defaultItems = [
    <MenuItem
        key="stuggle"
        type="struggle"
        icon="star-of-life"
        text="Help me with..."
    />,
    <View style={styles.spacer} key="spacer2" />,
    <MenuItem
        key="break"
        type="break"
        icon="times-octagon"
        category="breakHabit"
        text="Break a Habit"
    />,
    <MenuItem key="make" type="make" icon="lightbulb-on" text="Make a Habit" />,
    <View style={styles.spacer} key="spacer" />,
    <MenuItem key="todo" type="todo" icon="check" text="New To Do" />,
]

export function AddButton({ contents = defaultItems }) {
    const [isOpen, setOpen] = useState(false)
    const toggled = useRef(0)
    const open = useSharedValue(0)
    const progress = useDerivedValue(() => {
        return withTiming(open.value, { duration: 400 })
    })
    const insets = useSafeAreaInsets()
    const items = contents.length
    const width = Dimensions.get('window').width * 0.66
    const radius = 24
    const height = Math.max(1, items) * 50 + 48
    const content = useAnimatedStyle(() => {
        const translateY = interpolate(
            progress.value,
            [0, 0.65, 1],
            [1060, 60, 0],
        )
        const scale = interpolate(progress.value, [0, 0.65, 1], [0, 0.8, 1])
        const opacity = interpolate(
            progress.value,
            [0.75, 1],
            [0, 1],
            Extrapolate.CLAMP,
        )
        return {
            opacity,
            transform: [{ translateY }, { scale }],
        }
    })
    const animated = useAnimatedProps(() => {
        const currentHeight = mix(progress.value, radius * 2, height - radius)
        const currentWidth = interpolate(
            currentHeight,
            [0, height * 0.6, height - radius],
            [radius * 2, radius * 2, width],
        )

        const x = interpolate(currentWidth, [0, width], [width / 2, 0])
        const y = interpolate(
            currentHeight,
            [radius * 2, height - radius],
            [height - radius * 2, 0],
        )
        return {
            rx: radius,
            ry: radius,
            width: currentWidth,
            height: currentHeight,
            x,
            y,
        }
    })
    const iconStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { rotate: `${mix(progress.value, 0, Math.PI / 4)}rad` },
            ],
        }
    })
    const [position, contentStyle] = useMemo(() => {
        return [
            {
                position: 'absolute',
                top: Dimensions.get('window').height - insets.bottom - 40,
                left: Dimensions.get('window').width / 2 - 16,
            },
            {
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                top: -height + radius * 3,
                left: -Dimensions.get('window').width * 0.33 + radius * 2,
                width: width - radius * 2,
                height: height - radius * 3,
            },
        ]
    }, [height, width, insets.bottom])
    const menuStyle = useAnimatedStyle(() => {
        const offset = interpolate(
            progress.value,
            [0, 0.00001, 1],
            [2000, 0, 0],
        )
        return {
            position: 'absolute',
            left: -width / 2 + 24,
            top: -height + 48 + offset,
        }
    })
    const d = useMemo(() => {
        const arc = (x, y, reverse = false) =>
            `a ${radius} ${radius} 0 0 ${reverse ? '0' : '1'} ${x} ${y}`
        return [
            `M 0 ${radius}`,
            arc(radius, -radius),
            `h ${width - radius * 2}`,
            arc(radius, radius),
            `v ${height - radius * 2}`,
            arc(-radius, radius),
            `h ${-(width - radius * 2)}`,
            arc(-radius, -radius),
            'Z',
        ].join(' ')
    }, [width, height, radius])
    return (
        <CloseContext.Provider value={close}>
            <View style={[StyleSheet.absoluteFill]} pointerEvents={'box-none'}>
                {isOpen && (
                    <View style={[StyleSheet.absoluteFill]}>
                        <Pressable onPress={close}>
                            <View
                                style={[
                                    StyleSheet.absoluteFill,
                                    {
                                        width: Dimensions.get('window').width,
                                        height: Dimensions.get('window').height,
                                    },
                                ]}
                            />
                        </Pressable>
                    </View>
                )}
                <View pointerEvents="box-none" style={position}>
                    <Animated.View pointerEvents="box-none" style={menuStyle}>
                        <Svg width={width} height={height}>
                            <Defs>
                                <Mask id="mask">
                                    <AnimatedRect
                                        animatedProps={animated}
                                        fill="white"
                                    />
                                </Mask>
                            </Defs>
                            <Path d={d} fill="white" mask="url(#mask)" />
                        </Svg>
                    </Animated.View>

                    <View pointerEvents="box-none" style={styles.icon}>
                        <Pressable
                            onPress={toggle}
                            onPressIn={setPart}
                            onPressOut={setPartOut}>
                            <Animated.View style={iconStyle}>
                                <Icon
                                    icon="plus"
                                    color={palette.all.app.backgroundColor}
                                    size={32}
                                />
                            </Animated.View>
                        </Pressable>
                    </View>
                    <Animated.View
                        pointerEvents="box-none"
                        style={[
                            contentStyle,
                            { bottom: insets.bottom },
                            content,
                        ]}>
                        {contents}
                    </Animated.View>
                </View>
            </View>
        </CloseContext.Provider>
    )
    function close() {
        open.value = 0
        setOpen(false)
    }

    function setPart() {
        open.value = open.value < 0.2 ? 0.15 : 0.92
    }
    function setPartOut() {
        open.value = open.value < 0.2 ? 0 : 1
    }

    function toggle() {
        setTimeout(() => {
            toggled.current = Date.now()
            open.value = isOpen ? 0 : 1
            setOpen(!isOpen)
        })
    }
}
