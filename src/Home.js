import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native'
import React from 'react'
import { usePalette } from './config/palette'
import { useTasks } from './tasks'
import { Mounted } from './lib/Mounted'
import { TaskListItem } from './tasks/TaskListItem'

const homeStyles = StyleSheet.create({
    home: {
        maxHeight: Dimensions.get('window').height,
        overflow: 'visible',
    },
    spacer: {
        flexGrow: 1,
    },
    full: {
        height: Dimensions.get('window').height,
    },
})

export function Home() {
    const [styles, isDarkMode] = usePalette()
    const tasks = useTasks()
    return (
        <SafeAreaView style={[styles.text, styles.app, homeStyles.home]}>
            <StatusBar barStyle={'light-content'} />
            <View style={homeStyles.full}>
                <View style={homeStyles.spacer} />
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={[styles.text, homeStyles.home]}>
                    <Mounted>
                        {tasks.map(task => (
                            <TaskListItem task={task} key={task.id} />
                        ))}
                    </Mounted>
                </ScrollView>
                <View style={homeStyles.spacer} />
            </View>
        </SafeAreaView>
    )
}
