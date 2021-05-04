import { DarkTheme } from 'react-native-paper'
import { palette } from '../config/palette'
import Color from 'color'

export const theme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        surface: Color(palette.all.app.backgroundColor).lighten(0.2).hex(),
        background: palette.all.app.backgroundColor,
        contrastText: palette.all.app.darkColor,
        accent: palette.all.app.accent,
        primary: '#ff8811',
    },
}
