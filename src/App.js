/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { DarkTheme, NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { BestLifeNav } from './BestLifeNav'
import { AchievementsNav } from './AchievementsNav'
import { Home } from './Home'
import { tabIcon } from './lib/tab-icon'
import { Overlay } from './Overlay'
import { completed } from './screens/completed'
import { palette } from './config/palette'
import { AddButton } from './tasks/AddButton'
import { createStackNavigator } from '@react-navigation/stack'
import { Goal } from './tasks/Goal'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

const styles = StyleSheet.create({
    outer: {
        backgroundColor: '#333',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
})

const App = () => {
    useEffect(() => {
        completed('Hello')
    })
    return (
        <View style={styles.outer}>
            <NavigationContainer style={styles.outer} theme={DarkTheme}>
                <Stack.Navigator
                    screenOptions={{
                        cardOverlayEnabled: true,
                        cardStyle: { backgroundColor: '#000' },
                    }}>
                    <Stack.Screen
                        options={{ headerShown: false }}
                        name={'Tasks'}
                        component={Main}
                    />
                    <Stack.Screen name={'Set A Goal'} component={Goal} />
                </Stack.Navigator>
            </NavigationContainer>
            <Overlay />
        </View>
    )
}

export const StackNavigatorContext = React.createContext()

let stackNavigator

export function getStackNavigator() {
    return stackNavigator
}

function Main({ navigation }) {
    stackNavigator = navigation
    return (
        <StackNavigatorContext.Provider value={navigation}>
            <Tab.Navigator
                tabBarOptions={{
                    activeTintColor: 'white',
                    inactiveTintColor: 'rgba(255,255,255,0.4)',
                    style: {
                        color: 'white',
                        borderTopWidth: 0,
                        paddingTop: 4,
                        backgroundColor: palette.all.app.backgroundColor,
                    },
                }}
                style={styles.outer}>
                <Tab.Screen
                    style={styles.outer}
                    options={tabIcon('tasks')}
                    name={'Tasks'}
                    component={Home}
                />
                <Tab.Screen
                    options={tabIcon('trophy')}
                    name={'Achievements'}
                    component={AchievementsNav}
                />
                <Tab.Screen
                    style={styles.outer}
                    name={' '}
                    component={Home}
                    listeners={{
                        tabPress: e => {
                            e.preventDefault()
                        },
                    }}
                />
                <Tab.Screen
                    options={tabIcon('sliders-v')}
                    name={'Configure'}
                    component={BestLifeNav}
                />
                <Tab.Screen
                    options={tabIcon('running')}
                    name={'My Best Life'}
                    component={BestLifeNav}
                />
            </Tab.Navigator>
            <AddButton />
        </StackNavigatorContext.Provider>
    )
}

export default App
