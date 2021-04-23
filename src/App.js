/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react'
import { StyleSheet, useColorScheme, View } from 'react-native'
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
import { Overlay } from './Overlay'
import { congratulations } from './screens/congratulations'
import { Celebration, Fireworks, StarBadge } from './animations'

const Tab = createBottomTabNavigator()

const styles = StyleSheet.create({
    outer: {
        width: '100%',
        height: '100%',
    },
})

const App = () => {
    const isDarkMode = useColorScheme() === 'dark'
    useEffect(() => {
        congratulations({
            name: 'Did something',
            badge: <StarBadge width={0.33} />,
            background: (
                <View>
                    <Celebration />
                    <Fireworks />
                </View>
            ),
        })
    })
    return (
        <View style={styles.outer}>
            <NavigationContainer
                style={styles.outer}
                theme={isDarkMode ? DarkTheme : DefaultTheme}>
                <Tab.Navigator style={styles.outer}>
                    <Tab.Screen
                        style={styles.outer}
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
            <Overlay />
        </View>
    )
}

export default App
