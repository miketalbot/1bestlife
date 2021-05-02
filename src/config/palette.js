import { useColorScheme } from 'react-native'
import merge from 'lodash-es/merge'

export const palette = {
    all: {
        title: {
            fontSize: 58,
            fontWeight: '100',
        },
        app: {
            backgroundColor: '#15383d',
        },
    },
    dark: {
        text: {
            color: '#f3f3f3',
        },
        title: {
            color: '#389cb5',
        },
    },
    light: {
        text: {
            color: '#444',
        },
        title: {
            color: '#389cb5',
        },
    },
}

palette.dark = merge({ ...palette.all }, palette.dark)
palette.light = merge({ ...palette.all }, palette.light)

export function usePalette() {
    const isDarkMode = useColorScheme() === 'dark' || true
    return [palette[isDarkMode ? 'dark' : 'light'], isDarkMode]
}
