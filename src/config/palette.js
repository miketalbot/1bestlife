import { useColorScheme } from 'react-native'
import merge from 'lodash-es/merge'

export const palette = {
    all: {
        title: {
            fontSize: 58,
            fontWeight: '100',
        },
    },
    dark: {
        text: {
            backgroundColor: '#0C0C0C',
            color: '#f3f3f3',
        },
        title: {
            color: '#389cb5',
        },
    },
    light: {
        text: {
            backgroundColor: '#fff',
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
    const isDarkMode = useColorScheme() === 'dark'
    return [palette[isDarkMode ? 'dark' : 'light'], isDarkMode]
}
