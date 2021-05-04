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
            darkPanel: '#1d122c',
            color: '#fff',
            accent: '#ff8811',
            secondary: '#f90093',
            headerTintColor: '#fff6',
            darkColor: '#333',
            lightBackgroundColor: '#ffffff80',
        },
        tabs: {
            activeTintColor: '#fff',
            inactiveTintColor: 'rgba(255,255,255,0.4)',
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
