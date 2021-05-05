/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { Fragment, useMemo } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { DarkTheme, NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { BestLifeNav } from './BestLifeNav'
import { AchievementsNav } from './AchievementsNav'
import { Home } from './Home'
import { tabIcon } from 'lib/tab-icon'
import { Overlay } from './Overlay'
import { palette } from 'config/palette'
import { AddButton } from 'tasks/AddButton'
import { createStackNavigator } from '@react-navigation/stack'
import { NewTask } from 'tasks/NewTask'
import { setStackNavigator } from 'lib/navigation'
import { useScreens } from 'lib/screens'

const Tab = createBottomTabNavigator()

const styles = StyleSheet.create({
    outer: {
        backgroundColor: '#333',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
})

const App = () => {
    const screens = useScreens()
    const stack = useMemo(() => {
        return createStackNavigator()
    }, [screens._id])
    return (
        <View style={styles.outer}>
            <NavigationContainer
                key={`${screens._id}+${screens.length}`}
                ref={setStackNavigator}
                style={styles.outer}
                theme={DarkTheme}>
                <stack.Navigator
                    screenOptions={{
                        cardOverlayEnabled: true,
                        headerStyle: {
                            backgroundColor: palette.all.app.backgroundColor,
                        },
                        headerTintColor: palette.all.app.headerTintColor,
                    }}>
                    <stack.Screen
                        options={{ headerShown: false }}
                        name={'Tasks'}
                        component={Main}
                    />
                    <stack.Screen
                        options={({
                            route: {
                                params: { title },
                            },
                        }) => ({
                            title,
                        })}
                        name={'Set A NewTask'}
                        component={NewTask}
                    />
                    {screens.map(screen => (
                        <stack.Screen key={screen.name} {...screen} />
                    ))}
                </stack.Navigator>
            </NavigationContainer>
            <Overlay />
        </View>
    )
}

function Main() {
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
