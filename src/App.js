/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react'
import { useColorScheme } from 'react-native'
import {
    DarkTheme,
    DefaultTheme,
    NavigationContainer,
} from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { BestLifeNav } from './BestLifeNav'
import { AchievementsNav } from './AchievementsNav'
import { HomeNav } from './HomeNav'
import { tabIcon } from './lib/tab-icon'

const Tab = createBottomTabNavigator()

const App = () => {
    const isDarkMode = useColorScheme() === 'dark'

    return (
        <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
            <Tab.Navigator>
                <Tab.Screen
                    options={tabIcon('home')}
                    name={'Home'}
                    component={HomeNav}
                />
                <Tab.Screen
                    options={tabIcon('trophy')}
                    name={'Achievements'}
                    component={AchievementsNav}
                />
                <Tab.Screen
                    options={tabIcon('fitness')}
                    name={'My Best Life'}
                    component={BestLifeNav}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default App
