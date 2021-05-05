import React, { ReactNode } from 'react'
import { Dimensions, ImageStyle, TextStyle, ViewStyle } from 'react-native'
import {
    createBox,
    createText,
    ThemeProvider as ReStyleThemeProvider,
    useTheme as useReTheme,
} from '@shopify/restyle'
import { palette } from '../config/palette'
import Color from 'color'

const { width } = Dimensions.get('window')

export const aspectRatio = width / 375

const theme = {
    colors: {
        primary: palette.all.app.accent,
        primaryLight: Color(palette.all.app.accent).lighten(0.3).hex(),
        secondary: palette.all.app.accent,
        danger: '#FF0058',
        info: '#808080',
        edit: Color(palette.all.app.accent).darken(0.2).hex(),
        text: palette.all.app.color,
        textContrast: palette.all.app.darkColor,
        textMuted: Color(palette.all.app.color).fade(0.5).hex() + 'A0',
        background: palette.all.app.backgroundColor,
        background2: palette.all.app.lightBackgroundColor,
    },
    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 40,
        input: 12,
    },
    borderRadii: {
        s: 4,
        m: 10,
        l: 25,
        xl: 75,
    },
    textVariants: {
        hero: {
            fontSize: 80,
            lineHeight: 80,
            color: 'background',
            textAlign: 'center',
        },
        title1: {
            fontSize: 28,
            color: 'secondary',
        },
        title2: {
            fontSize: 24,
            lineHeight: 30,
            color: 'secondary',
        },
        title3: {
            fontSize: 16,
            color: 'secondary',
        },
        body: {
            fontSize: 16,
            lineHeight: 24,
            color: 'text',
        },
        button: {
            fontSize: 15,
            color: 'text',
            textAlign: 'center',
        },
        header: {
            fontSize: 12,
            lineHeight: 24,
            color: 'secondary',
        },
        action: {
            fontSize: 14,
            color: 'primary',
        },
        label: {
            fontSize: 12,
            color: 'textMuted',
        },
        iconTitle: {
            fontSize: 12,
            color: 'textMuted',
            textAlign: 'center',
        },
    },
    breakpoints: {
        phone: 0,
        tablet: 768,
    },
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => (
    <ReStyleThemeProvider {...{ theme }} children={children} />
)

export type Theme = typeof theme
export const Box = createBox<Theme>()
export const Text = createText<Theme>()
export const useTheme = () => useReTheme<Theme>()
type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle }

export const makeStyles = <T extends NamedStyles<T>>(
    styles: (theme: Theme) => T,
) => () => {
    const currentTheme = useTheme()
    return styles(currentTheme)
}
