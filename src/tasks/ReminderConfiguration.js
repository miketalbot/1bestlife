import { addScreen } from '../lib/screens'
import { Page } from '../lib/page'
import React, { useState } from 'react'
import { addDebugger } from '../lib/DebuggerView'
import { Box, Text } from '../components/Theme'
import { Button } from 'react-native-paper'
import { ScrollView } from 'react-native'
import { Checkbox } from '../lib/Checkbox'
import { PropertyBox } from '../lib/PropertyBox'

export const ReminderEdit = addScreen(
    function ReminderEdit({
        route: {
            params: { reminder, isNew, addReminder },
        },
    }) {
        return (
            <Page
                footer={
                    <Box mt="s" mb="s" pl="l" pr="l">
                        <Button mode="contained">
                            {isNew ? 'Add Reminder' : 'Update Reminder'}
                        </Button>
                    </Box>
                }>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <PropertyBox pt="s" pl="m" pr="m"></PropertyBox>
                </ScrollView>
            </Page>
        )
    },
    {
        options({
            route: {
                params: { isNew },
            },
        }) {
            return { headerTitle: isNew ? 'New Reminder' : 'Edit Reminder' }
        },
    },
)

export const ReminderConfiguration = addScreen(
    function ReminderConfiguration({
        route: {
            params: { settings },
        },
    }) {
        const [standard, setStandard] = useState(settings.standard !== false)
        const [reminders, setReminders] = useState(settings.reminders || [])
        return (
            <Page
                footer={
                    <Box mt="s" mb="s" pl="l" pr="l">
                        <Button mode="contained">Set Reminders</Button>
                    </Box>
                }>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <PropertyBox pt="s" pl="m" pr="m">
                        <Checkbox
                            text="All standard reminders"
                            value={standard}
                            onChanged={setStandard}
                        />
                        <Box mt="m">
                            <Text variant="label">Custom Reminders</Text>
                        </Box>
                        <Button onPress={addReminder} mode="outlined">
                            + Reminder
                        </Button>
                    </PropertyBox>
                </ScrollView>
            </Page>
        )

        function addReminder() {
            ReminderEdit.navigate({ isNew: true, reminder: {} })
        }
    },
    {
        options: { headerTitle: 'Reminders' },
    },
)

addDebugger('Reminders', () => {
    ReminderConfiguration.navigate({ settings: {} })
})
