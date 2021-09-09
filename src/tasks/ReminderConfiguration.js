import { addScreen } from '../lib/screens'
import { ScrollingPage } from '../lib/page'
import React, { useEffect, useState } from 'react'
import { Box, Text } from '../components/Theme'
import { Button } from 'react-native-paper'
import { Checkbox } from '../lib/Checkbox'
import { ReminderEdit } from './ReminderEdit'
import { Icon } from '../lib/icons'
import { palette } from '../config/palette'
import { FullWidthPressable } from '../lib/FullWidthPressable'
import { useRefresh } from '../lib/hooks'
import { InputChevron } from '../lib/InputChevron'

export const ReminderConfiguration = addScreen(
    function ReminderConfiguration({
        navigation,
        route: {
            params: { settings, refresh: parentRefresh },
        },
    }) {
        const refresh = useRefresh()
        const [standard, setStandard] = useState(settings.standard !== false)
        const [reminders, setReminders] = useState(settings.reminders || [])
        settings.reminders = reminders
        settings.standard = standard
        const toDisplay = reminders.filter(reminder => {
            return (
                reminder.type === settings.type &&
                reminder.dateMode === settings.dateMode
            )
        })
        useEffect(() => {
            parentRefresh()
        }, [JSON.stringify([settings.reminders, settings.standard])])
        return (
            <ScrollingPage
                footer={
                    <Box mt="s" mb="s" pl="l" pr="l">
                        <Button
                            onPress={() => navigation.goBack()}
                            mode="contained">
                            Done
                        </Button>
                    </Box>
                }
                settings={settings}
                refresh={refresh}>
                <Checkbox
                    text="All standard reminders"
                    value={standard}
                    onChanged={setStandard}
                />
                <Box mt="m">
                    <Text variant="label">Custom Reminders</Text>
                </Box>
                <Box mt="s" width="100%">
                    {toDisplay.map(reminder => {
                        const { id, icon, description } = reminder
                        return (
                            <FullWidthPressable
                                key={id}
                                onPress={edit(reminder)}>
                                <Box
                                    mb="s"
                                    flexDirection="row"
                                    width="100%"
                                    alignItems="center">
                                    <Box mr="s">
                                        <Icon
                                            color={palette.all.app.color}
                                            icon={icon}
                                        />
                                    </Box>
                                    <Box mr="s">
                                        <Text variant="body">
                                            {description}
                                        </Text>
                                    </Box>
                                    <InputChevron />
                                </Box>
                            </FullWidthPressable>
                        )
                    })}
                </Box>
                <Button onPress={newReminder} mode="outlined">
                    + Reminder
                </Button>
            </ScrollingPage>
        )

        function edit(reminder) {
            return function () {
                ReminderEdit.navigate({
                    isNew: false,
                    reminder,
                    addReminder,
                    deleteReminder,
                    settings,
                    refresh,
                })
            }
        }

        function newReminder() {
            ReminderEdit.navigate({
                isNew: true,
                reminder: {},
                addReminder,
                settings,
                refresh,
            })
        }

        function deleteReminder(reminder) {
            setReminders(current => current.filter(r => r !== reminder))
        }

        function addReminder(reminder) {
            setReminders(current => [...current, reminder])
        }
    },
    {
        options: { headerTitle: 'Reminders' },
    },
)

// addDebugger('Reminders 1', () => {
//     ReminderConfiguration.navigate({
//         settings: { type: 'todo', dateMode: 'by' },
//         refresh: () => {},
//     })
// })
// addDebugger('Reminders 2', () => {
//     ReminderConfiguration.navigate({
//         settings: { type: 'todo', dateMode: 'at' },
//         refresh: () => {},
//     })
// })
