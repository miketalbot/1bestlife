import React, { useState } from 'react'
import { addScreen } from 'lib/screens'
import { StyleSheet } from 'react-native'
import { palette } from 'config/palette'
import { TextInputAdorned } from 'lib/text-input'
import { addDebugger } from 'lib/DebuggerView'
import { TaskType } from './TaskType'
import { CategoryInput } from './CategoryInput'
import { PropertyBox } from 'lib/PropertyBox'
import { Case, Switch } from 'lib/switch'
import { Button, RadioButton } from 'react-native-paper'
import { IconInput } from 'lib/ChooseIcon'
import { Page } from '../lib/page'
import { Box } from '../components/Theme'

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
        const [category, setCategory] = useState(initialCategory)
        const [type, setType] = useState(initialType)
        const [name, setName] = useState(text)
        const [icon, setIcon] = useState('star')
        const [settings] = useState({})
        return (
            <Page
                footer={
                    <Box mt="s" mb="s" pl="l" pr="l">
                        <Button mode="contained">Add Task</Button>
                    </Box>
                }
                style={[StyleSheet.absoluteFill, styles.taskPage]}>
                <PropertyBox style={styles.contents}>
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
                            then={<TodoEditor settings={settings} />}
                        />
                    </Switch>
                </PropertyBox>
            </Page>
        )
    },
    { options: { headerTitle: 'Configure' } },
)

function TodoEditor({ settings }) {
    const [mode, setMode] = useState('asap')
    return (
        <RadioButton.Group onValueChange={setMode} value={mode}>
            <RadioButton.Item label="As soon as possible" value="asap" />
            <RadioButton.Item label="Within a week" value="week" />
            <RadioButton.Item label="By" value="by" />
        </RadioButton.Group>
    )
}

addDebugger('Configure', () => {
    ConfigureTask.navigate({
        type: 'todo',
        text: 'Example Task',
        typeId: 'custom',
        category: 'food',
    })
})
