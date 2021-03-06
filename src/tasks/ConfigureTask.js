import React, { useState } from 'react'
import { addScreen } from 'lib/screens'
import { StyleSheet } from 'react-native'
import { palette } from 'config/palette'
import { TextInputAdorned } from 'lib/text-input'
import { TaskType } from './TaskType'
import { CategoryInput } from './CategoryInput'
import { Case, Switch } from 'lib/switch'
import { Button, TextInput } from 'react-native-paper'
import { IconInput } from 'lib/ChooseIcon'
import { ScrollingPage } from 'lib/page'
import { Box } from 'components/Theme'
import { TodoEditor } from './TodoEditor'
import { useRefresh } from 'lib/hooks'
import { DailyEditor } from './DailyEditor'
import { WeeklyEditor } from './WeeklyEditor'
import { MonthlyEditor } from './MonthlyEditor'
import { Settings, SettingsContext } from 'lib/SettingsContext'
import { Reminders } from './Reminders'
import { useDirty } from '../lib/dirty'
import { TimedTask } from './TimedTask'

const styles = StyleSheet.create({
    taskPage: {
        backgroundColor: palette.all.app.backgroundColor,
    },
    contents: {
        padding: 8,
        flex: 1,
    },
})

export const ConfigureTask = addScreen(
    function ConfigureTask({
        route: {
            params: {
                text,
                isNew = !removeTask,
                typeId,
                addTask,
                removeTask,
                type: initialType,
                category: initialCategory,
                task,
                icon: initialIcon,
                settings: initialSettings = {},
            },
        },
    }) {
        task = task || { settings: initialSettings, icon: initialIcon }
        const refresh = useRefresh()
        const dirty = useDirty()
        dirty.useAlert(commitTask)
        const [category, setCategory] = useState(
            task?.category ?? initialCategory,
        )
        const [name, setName] = dirty.useState(task?.text ?? text)
        const [icon, setIcon] = dirty.useState(task?.icon ?? 'star')
        const [motivation, setMotivation] = dirty.useState(
            task?.motivation ?? '',
        )
        const [settings] = useState(task?.settings ?? {})
        return (
            <dirty.Provider>
                <Settings
                    settings={settings}
                    refresh={refresh}
                    commit={commitTask}>
                    <ScrollingPage
                        footer={
                            <Box mt="s" mb="s" pl="l" pr="l">
                                <Button onClick={commitTask} mode="contained">
                                    Add Task
                                </Button>
                            </Box>
                        }>
                        <IconInput value={icon} onChange={setIcon} />
                        <TextInputAdorned
                            label="To do"
                            value={name}
                            onChangeText={setName}
                        />

                        <CategoryInput
                            value={category}
                            onChange={setCategory}
                        />
                        <TaskType
                            value={settings.type}
                            onChange={v => {
                                settings.type = v
                                refresh()
                            }}
                        />
                        <Switch value={settings.type}>
                            <Case
                                when="todo"
                                then={
                                    <TodoEditor
                                        refresh={refresh}
                                        settings={settings}
                                    />
                                }
                            />
                            <Case
                                when="daily"
                                then={
                                    <DailyEditor
                                        refresh={refresh}
                                        settings={settings}
                                    />
                                }
                            />
                            <Case
                                when="weekly"
                                then={
                                    <WeeklyEditor
                                        refresh={refresh}
                                        settings={settings}
                                    />
                                }
                            />
                            <Case
                                when="monthly"
                                then={
                                    <MonthlyEditor
                                        refresh={refresh}
                                        settings={settings}
                                    />
                                }
                            />
                        </Switch>
                        {settings.type && (
                            <Reminders settings={settings} refresh={refresh} />
                        )}
                        {settings.type && <TimedTask settings={settings} />}
                        {settings.type && (
                            <TextInput
                                multiline
                                label="Your Motivation"
                                value={motivation}
                                onChangeText={setMotivation}
                            />
                        )}
                    </ScrollingPage>
                </Settings>
            </dirty.Provider>
        )

        function commitTask() {}
    },
    {
        options: ({ isNew = !removeTask, removeTask }) => ({
            headerTitle: isNew ? 'Create Goal' : 'Edit Goal',
        }),
    },
)

// addDebugger('Configure', () => {
//     ConfigureTask.navigate({
//         type: 'todo',
//         text: 'Example Task',
//         typeId: 'custom',
//         category: 'food',
//     })
// })
