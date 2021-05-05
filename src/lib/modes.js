import { palette } from '../config/palette'
import { ToggleBox, ToggleGroup } from './toggle-button'
import { Box, Text } from '../components/Theme'
import React, { useMemo } from 'react'

const modeStyles = {
    selected: {
        color: palette.all.app.darkColor,
        borderColor: palette.all.app.darkColor,
    },
    standard: {
        color: palette.all.app.mutedColor,
        borderColor: palette.all.app.mutedColor,
    },
}

export function useModes(modes, current) {
    return useMemo(() => {
        return (
            <ToggleGroup>
                {Object.entries(modes).map(([name, contents]) => {
                    const selected = current === name || current[name]
                    return contents({
                        name,
                        selected,
                        style: selected
                            ? modeStyles.selected
                            : modeStyles.standard,
                    })
                })}
            </ToggleGroup>
        )
    }, [JSON.stringify(current)])
}

export function mode(text, set = () => {}) {
    return function ({ name, selected, style }) {
        return (
            <ToggleBox onPress={() => set(name)} key={name} {...{ selected }}>
                <Box
                    width="100%"
                    flexGrow={1}
                    alignItems="center"
                    minHeight={40}
                    p="s"
                    justifyContent="space-around">
                    {typeof text === 'string' && (
                        <Text style={style}>{text}</Text>
                    )}
                    {typeof text !== 'string' &&
                        typeof text === 'function' &&
                        text({ name, selected, style })}
                    {typeof text !== 'string' &&
                        typeof text !== 'function' &&
                        text}
                </Box>
            </ToggleBox>
        )
    }
}
