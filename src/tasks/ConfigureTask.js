import React, { useState } from 'react'
import { addScreen } from 'lib/screens'
import { StyleSheet } from 'react-native'
import { palette } from 'config/palette'
import { TextInputAdorned } from 'lib/text-input'
import { addDebugger } from 'lib/DebuggerView'
import { TaskType } from './TaskType'
import { CategoryInput } from './CategoryInput'
import { Case, Switch } from 'lib/switch'
import { Button } from 'react-native-paper'
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
                typeId,
                type: initialType,
                category: initialCategory,
            },
        },
    }) {
        const refresh = useRefresh()
        const [category, setCategory] = useState(initialCategory)
        const [type, setType] = useState(initialType)
        const [name, setName] = useState(text)
        const [icon, setIcon] = useState('star')
        const [settings] = useState({})
        settings.type = type
        return (
            <Settings settings={settings} refresh={refresh} commit={commitTask}>
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
                        label="Task"
                        value={name}
                        onChangeText={setName}
                    />

                    <CategoryInput value={category} onChange={setCategory} />
                    <TaskType value={type} onChange={setType} />
                    <Switch value={type}>
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
                    <Reminders settings={settings} refresh={refresh} />
                </ScrollingPage>
            </Settings>
        )

        function commitTask() {}
    },
    { options: { headerTitle: 'Configure' } },
)

addDebugger('Configure', () => {
    ConfigureTask.navigate({
        type: 'todo',
        text: 'Example Task',
        typeId: 'custom',
        category: 'food',
    })
})
