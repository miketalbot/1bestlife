/**
 * @format
 */
import React from 'react'
import { AppRegistry } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'
import { Provider } from 'react-native-paper'
import { User } from './src/user-context'
import { ThemeProvider } from './src/components/Theme'
import { SafeAreaProvider } from 'react-native-safe-area-context/src/SafeAreaContext'

AppRegistry.registerComponent(appName, () => Main)

function Main() {
    return (
        <User>
            <SafeAreaProvider>
                <Provider>
                    <ThemeProvider>
                        <App />
                    </ThemeProvider>
                </Provider>
            </SafeAreaProvider>
        </User>
    )
}
