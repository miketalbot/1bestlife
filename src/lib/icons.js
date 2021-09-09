import React from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import * as Icons from '@fortawesome/pro-solid-svg-icons'
import * as LightIcons from '@fortawesome/pro-light-svg-icons'
import Sugar from 'sugar'
import { Pressable } from 'react-native'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated'
import { mix } from 'react-native-redash'
import { customIcons } from '../custom-icons'

function addIcons(scanIcons) {
    const iconList = Object.keys(scanIcons)
        .filter(key => key !== scanIcons.prefix && key !== 'prefix')
        .map(icon => scanIcons[icon])

    library.add(...iconList)
}

addIcons(Icons)
addIcons(LightIcons)

export const icons = Object.keys(LightIcons)
    .filter(key => key !== LightIcons.prefix && key !== 'prefix')
    .map(icon => {
        return Sugar.String.dasherize(icon.slice(2))
    })

export function Icon({ icon, light = true, name, ...props }) {
    icon = icon || name
    if (icon?.startsWith('flat:')) {
        const Icon = customIcons[icon]
        const size = `${props.size || 25}px`
        return (
            <Icon
                {...props}
                width={size}
                height={size}
                fill={props.color || 'white'}
            />
        )
    }
    return (
        <FontAwesomeIcon
            icon={[light ? 'fal' : 'fas', icon]}
            size={25}
            {...props}
        />
    )
}
export function icon(name) {
    return function ({ size, color }) {
        return <Icon icon={name} {...{ size, color }} />
    }
}

export function IconButton({
    icon,
    color,
    disabled,
    backgroundColor,
    onPress = () => {},
    onPressIn = () => {},
    onPressOut = () => {},
    ...props
}) {
    const touched = useSharedValue(0)
    const highlightStyle = useAnimatedStyle(() => {
        return {
            borderRadius: 1000,
            backgroundColor,
            padding: 4,
            transform: [{ scale: mix(touched.value, 1, 1.35) }],
        }
    })
    return (
        <Pressable
            hitSlop={24}
            disabled={disabled}
            onPress={onPress}
            onPressIn={highlight}
            onPressOut={unhighlight}>
            <Animated.View style={highlightStyle}>
                <Icon icon={icon} color={color} {...props} />
            </Animated.View>
        </Pressable>
    )

    function highlight(...params) {
        touched.value = withSpring(1)
        onPressIn(...params)
    }

    function unhighlight(...params) {
        touched.value = withTiming(0)
        onPressOut(...params)
    }
}
