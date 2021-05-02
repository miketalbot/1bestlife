/**
 * @format
 */
import React from 'react'
import { AppRegistry } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'
import { DarkTheme, Provider } from 'react-native-paper'
import { User } from './src/user-context'
import { ThemeProvider } from './src/components/Theme'
import { SafeAreaProvider } from 'react-native-safe-area-context/src/SafeAreaContext'
import { palette } from './src/config/palette'
import Sugar from 'sugar'
import './src/tasks/types'

Sugar.Array.extend()

AppRegistry.registerComponent(appName, () => Main)

const theme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        background: palette.all.app.backgroundColor,
        accent: '#c3423f',
        primary: '#ff8811',
    },
}

function Main() {
    return (
        <User>
            <SafeAreaProvider>
                <Provider theme={theme}>
                    <ThemeProvider>
                        <App />
                    </ThemeProvider>
                </Provider>
            </SafeAreaProvider>
        </User>
    )
}
