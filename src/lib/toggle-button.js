import React, { useMemo, useState } from 'react'
import { StyleSheet, Text, TouchableWithoutFeedback } from 'react-native'
import { theme } from './paper-theme'
import { ensureArray } from './ensure-array'
import { Box } from '../components/Theme'
import { Button } from 'react-native-paper'
import { palette } from '../config/palette'
import { Icon } from './icons'
import { FullWidthByPercentPressable } from './FullWidthPressable'
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable'

const styles = StyleSheet.create({
    left: {
        borderTopLeftRadius: theme.roundness,
        borderBottomLeftRadius: theme.roundness,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        overflow: 'hidden',
    },
    right: {
        borderTopRightRadius: theme.roundness,
        borderBottomRightRadius: theme.roundness,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        overflow: 'hidden',
    },
    middle: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
    },
    selected: {
        backgroundColor: palette.all.app.accent,
        color: palette.all.app.darkColor,
    },
    unselected: {
        color: palette.all.app.accent,
    },
})

export function ToggleButton({ children, icon, selected, ...props }) {
    return (
        <Button
            {...props}
            style={[...(props.style || []), selected && styles.selected]}>
            <Box alignItems="center">
                <Box mt="s" mb={'s'}>
                    <Icon
                        color={
                            selected
                                ? palette.all.app.darkColor
                                : palette.all.app.accent
                        }
                        icon={icon}
                    />
                </Box>
                <Text style={[selected ? styles.selected : styles.unselected]}>
                    {children}
                </Text>
            </Box>
        </Button>
    )
}

const boxStyles = StyleSheet.create({
    box: {
        borderColor: palette.all.app.inputBorder,
        borderWidth: 1,
        color: palette.all.app.color,
        alignItems: 'stretch',
        justifyContent: 'space-around',
        flexDirection: 'row',
        overflow: 'hidden',
    },
    toggleGroup: {
        overflow: 'hidden',
    },
    pressed: {
        backgroundColor: `${palette.all.app.accent}30`,
        opacity: 1,
    },
    selected: {
        borderColor: palette.all.app.backgroundColor,
        backgroundColor: palette.all.app.accent,
        color: palette.all.app.darkColor,
    },
    standardText: {
        color: palette.all.app.mutedColor,
    },
    selectedText: {
        color: palette.all.app.darkColor,
    },
    fullHeight: {
        height: '100%',
    },
    grow: {
        flexGrow: 1,
        alignSelf: 'stretch',
    },
    selectedBox: {},
})

export function ToggleBox({
    children,
    onPress,
    onPressIn,
    onPressOut,
    selected,
    ...props
}) {
    const toRender = React.Children.toArray(children).map(child => ({
        ...child,
        props: {
            ...child.props,
            styles: [
                selected ? boxStyles.selectedText : boxStyles.standardText,
            ],
        },
    }))
    const [pressed, setPressed] = useState(false)
    onPressIn = onPressIn || whenPressed
    onPressOut = onPressOut || whenUnpressed

    return (
        <Box
            {...props}
            style={[
                boxStyles.box,
                selected && boxStyles.selected,
                pressed && boxStyles.pressed,
                ...ensureArray(props.style),
            ]}>
            {!!onPress && (
                <FullWidthByPercentPressable
                    Component={TouchableWithoutFeedback}
                    flexDirection="column"
                    {...{ onPress, onPressIn, onPressOut }}>
                    {toRender}
                </FullWidthByPercentPressable>
            )}
            {!onPress && toRender}
        </Box>
    )

    function whenPressed() {
        setPressed(true)
    }

    function whenUnpressed() {
        setPressed(false)
    }
}

export function SelectedBox({
    children,
    onPress,
    onPressIn,
    onPressOut,
    selected,
    ...props
}) {
    const [pressed, setPressed] = useState(false)
    onPressIn = onPressIn || whenPressed
    onPressOut = onPressOut || whenUnpressed
    const toRender = React.Children.toArray(children).map(child => ({
        ...child,
        props: {
            ...child.props,
            styles: [
                selected ? boxStyles.selectedText : boxStyles.standardText,
            ],
        },
    }))
    return (
        <Pressable flexGrow={1} {...{ onPress, onPressIn, onPressOut }}>
            <Box
                {...props}
                style={[
                    boxStyles.selectedBox,
                    selected && boxStyles.selected,
                    pressed && boxStyles.pressed,
                    ...ensureArray(props.style),
                ]}>
                {toRender}
            </Box>
        </Pressable>
    )

    function whenPressed() {
        setPressed(true)
    }

    function whenUnpressed() {
        setPressed(false)
    }
}

export function ToggleGroup({ children, length, ...props }) {
    const modified = React.Children.toArray(children)
    const widthStyle = useMemo(() => {
        return {
            width: `${((1 / (length || modified.length)) * 100).toFixed(2)}%`,
        }
    }, [modified.length])
    for (let i = 0, l = modified.length; i < l; i++) {
        const child = modified[i]
        switch (i) {
            case 0:
                child.props = {
                    ...child.props,
                    style: [
                        widthStyle,
                        styles.left,
                        ...ensureArray(child.props.style),
                    ],
                }
                break
            case l - 1:
                child.props = {
                    ...child.props,
                    style: [
                        widthStyle,
                        styles.right,
                        ...ensureArray(child.props.style),
                    ],
                }
                break
            default:
                child.props = {
                    ...child.props,
                    style: [
                        widthStyle,
                        styles.middle,
                        ...ensureArray(child.props.style),
                    ],
                }
                break
        }
    }
    return (
        <Box
            {...props}
            style={[props.style, boxStyles.toggleGroup]}
            flexDirection="row"
            width="100%"
            alignItems="stretch">
            {modified.map(child => {
                return child
            })}
        </Box>
    )
}
