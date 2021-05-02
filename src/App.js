/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { Fragment } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { DarkTheme, NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { BestLifeNav } from './BestLifeNav'
import { AchievementsNav } from './AchievementsNav'
import { Home } from './Home'
import { tabIcon } from './lib/tab-icon'
import { Overlay } from './Overlay'
import { palette } from './config/palette'
import { AddButton } from './tasks/AddButton'
import { createStackNavigator } from '@react-navigation/stack'
import { Goal } from './tasks/Goal'
import { setStackNavigator } from './lib/navigation'

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
    return (
        <View style={styles.outer}>
            <NavigationContainer style={styles.outer} theme={DarkTheme}>
                <Stack.Navigator
                    screenOptions={{
                        cardOverlayEnabled: true,
                        headerStyle: {
                            backgroundColor: palette.all.app.backgroundColor,
                        },
                        headerTintColor: palette.all.app.headerTintColor,
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

function Main({ navigation }) {
    setStackNavigator(navigation)
    return (
        <Fragment>
            <Tab.Navigator
                tabBarOptions={{
                    ...palette.all.tabs,
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
            <AddButton key="addbutton" />
        </Fragment>
    )
}

export default App
