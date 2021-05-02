import { Dimensions, StyleSheet, View } from 'react-native'
import Animated, {
    useAnimatedProps,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated'
import React, { useEffect } from 'react'
import { mix } from 'react-native-redash'
import Svg, { Path } from 'react-native-svg'

const R = 4
const AnimatedPath = Animated.createAnimatedComponent(Path)

const styles = StyleSheet.create({
    colorBar: {
        width: 16,
        minHeight: 60,
        marginRight: 4,
    },
    absolute: {
        position: 'absolute',
    },
})

function arc(x, y, reverse = false) {
    'worklet'
    return `a ${R} ${R} 0 0 ${reverse ? '0' : '1'} ${x} ${y}`
}
function rectangle(animatedWidth, radius = R, height) {
    'worklet'
    return [
        `M 0 ${radius}`,
        arc(radius, -radius),
        `h ${animatedWidth - 2 * radius}`,
        arc(radius, radius),
        `v ${height - 2 * radius}`,
        arc(-radius, radius),
        `h -${animatedWidth - 2 * radius}`,
        arc(-radius, -radius),
        'Z',
    ].join(' ')
}

export function ColorBar({
    color,
    selected,
    pressed,
    height = 60,
    width = Dimensions.get('window').width,
}) {
    const open = useSharedValue(0)
    useEffect(() => {
        const percentageWidth = 1 - 70 / Dimensions.get('window').width
        open.value = withSpring(
            selected
                ? pressed
                    ? percentageWidth
                    : 1
                : pressed
                ? percentageWidth
                : 0,
            {
                overshootClamping: true,
            },
        )
    }, [selected, open, pressed])

    const animatedProps = useAnimatedProps(() => {
        return {
            d: rectangle(mix(open.value, 16, width), R, height),
        }
    })
    return (
        <View style={[styles.colorBar]}>
            <Svg style={styles.absolute} height={height} width={width}>
                <AnimatedPath animatedProps={animatedProps} fill={color} />
            </Svg>
        </View>
    )
}
