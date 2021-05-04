import React, { useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { palette } from '../config/palette'
import { TextInputDebounced } from '../lib/text-input'
import { IconButton } from '../lib/icons'
import { Box } from '../components/Theme'
import { If } from '../lib/switch'
import { CategorySelector } from './CategorySelector'
import { TaskChoices } from './TaskChoices'
import { ConfigureTask } from './ConfigureTask'
import { getAllTasks } from './register-task'
import { defer } from '../lib/defer'

const styles = StyleSheet.create({
    goalPage: {
        backgroundColor: palette.all.app.backgroundColor,
    },
    contents: {
        padding: 8,
        flex: 1,
    },
})

export function NewTask({
    route: { params: { type, category: initialCategory = '', ...props } } = {},
}) {
    const [name, setName] = useState('')
    const [tasks, setTasks] = useState(getAllTasks())
    const [category, setCategory] = useState(initialCategory)
    const categories = useMemo(() => {
        return new Set(Object.values(tasks).map('group'))
    }, [tasks])
    return (
        <View key="goal" style={[StyleSheet.absoluteFill, styles.goalPage]}>
            <View style={styles.contents}>
                <TextInputDebounced
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
                <CategorySelector
                    category={category}
                    has={check => categories.has(check)}
                    onChange={setCategory}
                />
                <TaskChoices
                    onTasks={defer(setTasks)}
                    category={category}
                    search={name}
                />
            </View>
        </View>
    )

    function makeTask() {
        ConfigureTask.navigate({ type, text: name, typeId: 'custom', category })
    }
}
