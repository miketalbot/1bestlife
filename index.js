/**
 * @format
 */
import React from 'react'
import { AppRegistry, LogBox } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'
import { Provider } from 'react-native-paper'
import { User } from './src/user-context'
import { ThemeProvider } from './src/components/Theme'
import { SafeAreaProvider } from 'react-native-safe-area-context/src/SafeAreaContext'
import Sugar from 'sugar'
import './src/tasks/types'
import { Icon } from './src/lib/icons'
import { theme } from './src/lib/paper-theme'

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
])
Sugar.Array.extend()

AppRegistry.registerComponent(appName, () => Main)

function Main() {
    return (
        <User>
            <SafeAreaProvider>
                <Provider
                    theme={theme}
                    settings={{ icon: props => <Icon {...props} /> }}>
                    <ThemeProvider>
                        <App />
                    </ThemeProvider>
                </Provider>
            </SafeAreaProvider>
        </User>
    )
}
