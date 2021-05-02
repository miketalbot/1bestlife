import React, { useMemo, useState } from 'react'
import {
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import { palette } from '../config/palette'
import { TextInputAdorned } from '../lib/text-input'
import { Icon, IconButton } from '../lib/icons'
import { Box } from '../components/Theme'
import { If } from '../lib/switch'
import { CategorySelector } from './CategorySelector'
import { getAllTasks } from './register-task'
import { ColorBar } from '../lib/ColorBar'
import { SelectableLine } from '../SelectableLine'
import { taskListItemStyles } from './TaskListItem'
import { Mounted } from '../lib/Mounted'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const styles = StyleSheet.create({
    goalPage: {
        backgroundColor: palette.all.app.backgroundColor,
    },
    contents: {
        padding: 8,
        flex: 1,
    },
    text: {
        color: 'white',
    },
})

export function Goal({ type }) {
    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    return (
        <View key="goal" style={[StyleSheet.absoluteFill, styles.goalPage]}>
            <View style={styles.contents}>
                <TextInputAdorned
                    label="Task"
                    value={name}
                    autoFocus
                    onChangeText={setName}
                    right={
                        <Box flexDirection="row">
                            <If truthy={name.length}>
                                <Box mr={'s'}>
                                    <IconButton
                                        onPress={() => setName('')}
                                        backgroundColor="#fff1"
                                        color={'white'}
                                        icon="times"
                                    />
                                </Box>
                            </If>
                            <If truthy={name.length > 5}>
                                <IconButton
                                    onPress={makeTask}
                                    backgroundColor="white"
                                    color={palette.all.app.backgroundColor}
                                    icon="chevron-right"
                                />
                            </If>
                        </Box>
                    }
                />
                <CategorySelector category={category} onChange={setCategory} />
                <TaskChoices category={category} search={name} />
            </View>
        </View>
    )

    function makeTask() {}
}

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

function TaskChoices({ search = '', category }) {
    search = search.toLowerCase()
    const list = useMemo(() => {
        return Object.entries(getAllTasks())
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
