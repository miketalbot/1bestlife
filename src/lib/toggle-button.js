import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { theme } from './paper-theme'
import { ensureArray } from './ensure-array'
import { Box } from '../components/Theme'
import { Button } from 'react-native-paper'
import { palette } from '../config/palette'
import { Icon } from './icons'

const styles = StyleSheet.create({
    left: {
        borderTopLeftRadius: theme.roundness,
        borderBottomLeftRadius: theme.roundness,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        flexGrow: 1,
    },
    right: {
        borderTopRightRadius: theme.roundness,
        borderBottomRightRadius: theme.roundness,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        flexGrow: 1,
    },
    middle: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        flexGrow: 1,
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
        borderColor: '#fff2',
    },
    selected: {
        borderColor: palette.all.app.accent,
        backgroundColor: palette.all.app.accent,
        color: palette.all.app.darkColor,
    },
})

export function ToggleBox({ children, selected, ...props }) {
    return (
        <Box
            {...props}
            style={[
                boxStyles.box,
                selected && boxStyles.selected,
                ...ensureArray(props.style),
            ]}>
            {children}
        </Box>
    )
}

export function ToggleGroup({ children }) {
    const modified = React.Children.toArray(children)
    for (let i = 0, l = modified.length; i < l; i++) {
        const child = modified[i]
        switch (i) {
            case 0:
                child.props = {
                    ...child.props,
                    style: [...ensureArray(child.props.style), styles.left],
                }
                break
            case l - 1:
                child.props = {
                    ...child.props,
                    style: [...ensureArray(child.props.style), styles.right],
                }
                break
            default:
                child.props = {
                    ...child.props,
                    style: [...ensureArray(child.props.style), styles.middle],
                }
                break
        }
    }
    return (
        <Box flexDirection="row" width="100%">
            {modified.map(child => {
                return child
            })}
        </Box>
    )
}
