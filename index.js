/**
 * @format
 */
import React from 'react'
import {AppRegistry} from 'react-native'
import App from './src/App'
import {name as appName} from './app.json'
import {Provider} from 'react-native-paper'
import {User} from './src/user-context'

AppRegistry.registerComponent(appName, () => Main)

function Main() {
  console.log('Main')
  return (
    <User>
      <Provider>
        <App />
      </Provider>
    </User>
  )
}
