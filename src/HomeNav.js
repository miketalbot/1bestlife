import { SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { usePalette } from './config/palette'
import { useTasks } from './tasks'
import { Task } from './tasks/task'
import { Mounted } from '../lib/Mounted'
import { useUser } from './user-context'

const Stack = createStackNavigator()

export function HomeNav() {
    return (
        <Stack.Navigator initialRouteName={'Home'}>
            <Stack.Screen name={'Home'} component={Home} />
        </Stack.Navigator>
    )
}

function Home() {
    const [styles, isDarkMode] = usePalette()
    const tasks = useTasks()
    const highPriority =
        tasks.length === 1 ? tasks[0] : tasks.find(t => t.priority === 'high')
    return (
        <SafeAreaView style={styles.text}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={styles.text}>
                <View style={styles.text}>
                    <View>
                        <WelcomeMessage />
                    </View>
                </View>
                <Mounted>
                    {highPriority && (
                        <Task key={highPriority.id} task={highPriority} />
                    )}
                </Mounted>
                <Text style={styles.title}>I'm here</Text>
            </ScrollView>
        </SafeAreaView>
    )
}

function WelcomeMessage() {
    const user = useUser()
    const [styles] = usePalette()
    return (
        <Text style={styles.title}>
            {user.name ? `Hi ${user.name}!` : 'Welcome!'}
        </Text>
    )
}