import React, { useMemo } from 'react'
import { getAllTasks } from './register-task'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import { Mounted } from '../lib/Mounted'
import { Box } from '../components/Theme'
import { ColorBar } from '../lib/ColorBar'
import { SelectableLine } from '../SelectableLine'
import { taskListItemStyles } from './TaskListItem'
import { Icon } from '../lib/icons'

function scoreTask(search, definition) {
    if (!search.trim()) {
        return 1
    }
    let totalScore = 0
    for (let part of search.split(' ').filter(s => !!s.trim())) {
        const words = definition.words.filter(w => w.startsWith(part))
        for (let word of words) {
            let baseScore = part.length / word.length
            totalScore +=
                (baseScore * Math.max(0.05, 5 - definition.wordOrder[word])) / 5
        }
    }
    return totalScore
}

const styles = StyleSheet.create({
    text: {
        color: 'white',
    },
})

export function TaskChoices({ search = '', category, onTasks = () => {} }) {
    search = search.toLowerCase()
    const list = useMemo(() => {
        let result = Object.entries(getAllTasks())
            .filter(
                ([, definition]) =>
                    definition.searchable !== false &&
                    (!category || definition.group === category),
            )
            .map(([name, definition]) => {
                let score = scoreTask(search, definition)
                return [
                    name,
                    {
                        ...definition,
                        score,
                        order: `${`000000${(1000 - score).toFixed(3)}`.slice(
                            -8,
                        )}:${definition.title.toLowerCase()}`,
                    },
                ]
            })
            .filter(([, { score }]) => !search.trim() || score > 0.05)
            .sortBy(['1.order'])
        onTasks(result.map('1'))
        return result
    }, [search, category])
    const insets = useSafeAreaInsets()
    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <ScrollView
                style={{
                    flex: 1,
                    marginTop: 11,
                    marginLeft: -8,
                    marginRight: -8,
                    paddingLeft: 8,
                    paddingRight: 8,
                }}>
                <Mounted springConfig={{ mass: 0.38 }}>
                    {list.map(([name, taskDef], i) => {
                        return (
                            <Box
                                key={`${name}${i}`}
                                mb="xs"
                                flexDirection="row"
                                alignItems="center">
                                <ColorBar color={taskDef.color || '#444'} />
                                <SelectableLine color={taskDef.color}>
                                    <Box
                                        flexDirection="row"
                                        alignItems="center"
                                        width="100%"
                                        height={60}>
                                        <View style={[taskListItemStyles.icon]}>
                                            {taskDef.icon ? (
                                                <Icon
                                                    color="white"
                                                    icon={taskDef.icon}
                                                />
                                            ) : null}
                                        </View>
                                        <View>
                                            <Text
                                                style={[
                                                    styles.text,
                                                    taskListItemStyles.taskItemTitle,
                                                ]}>
                                                {taskDef.title}
                                            </Text>
                                        </View>
                                        <View
                                            style={taskListItemStyles.spacer}
                                        />
                                        <View
                                            style={[
                                                taskListItemStyles.expander,
                                            ]}>
                                            <Icon
                                                icon="chevron-right"
                                                color="#fff"
                                            />
                                        </View>
                                    </Box>
                                </SelectableLine>
                            </Box>
                        )
                    })}
                </Mounted>
                <View style={{ height: insets.bottom + 60 }} />
            </ScrollView>
        </KeyboardAvoidingView>
    )
}
