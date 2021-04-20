import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    useColorScheme,
} from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import React from 'react'

export function AchievementsNav() {
    const isDarkMode = useColorScheme() === 'dark'
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    }

    return (
        <SafeAreaView style={backgroundStyle}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <ScrollView>
                <Text>Achievements</Text>
            </ScrollView>
        </SafeAreaView>
    )
}
