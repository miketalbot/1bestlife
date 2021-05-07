import { Chip } from 'react-native-paper'
import { Box, Text } from 'components/Theme'
import React from 'react'
import { ReminderConfiguration } from './ReminderConfiguration'
import { ensureArray } from '../lib/ensure-array'
import { StyleSheet } from 'react-native'
import { ReminderEdit } from './ReminderEdit'
import { CustomTextInput } from '../lib/CustomTextInput'
import { InputChevron } from '../lib/InputChevron'

const styles = StyleSheet.create({
    chip: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
})

export function Reminders({ settings, refresh }) {
    const reminders = getReminders(settings)
    return (
        <CustomTextInput
            label="Reminders"
            onPress={configure}
            value={reminders}
            render={({ value }) => (
                <>
                    <Box flexDirection="row" flexWrap="wrap">
                        {!!value.length &&
                            value.map((reminder, index) => {
                                return (
                                    <Box
                                        key={reminder.id || index}
                                        mr="s"
                                        mb="s">
                                        <Chip
                                            onPress={edit(reminder)}
                                            style={styles.chip}
                                            icon={reminder.icon}>
                                            {reminder.description}
                                        </Chip>
                                    </Box>
                                )
                            })}
                        {!value.length && (
                            <Box>
                                <Text variant="muted">No reminders</Text>
                            </Box>
                        )}
                    </Box>
                    <InputChevron mb="s" />
                </>
            )}
        />
    )

    function edit(reminder) {
        return function () {
            if (!reminder.id) {
                ReminderConfiguration.navigate({ settings, refresh })
            } else {
                ReminderEdit.navigate({
                    isNew: false,
                    reminder,
                    deleteReminder,
                    settings,
                    refresh,
                })
            }
        }
    }

    function deleteReminder(reminder) {
        settings.reminders = settings.reminders.filter(r => r !== reminder)
        refresh()
    }

    function configure() {
        ReminderConfiguration.navigate({ settings, refresh })
    }
}

function getReminders(settings) {
    const output = []
    if (settings.standard !== false) {
        output.push({ description: 'Standard Reminders' })
    }
    const other = ensureArray(settings.reminders).filter(
        reminder =>
            reminder.type === settings.type &&
            reminder.dateMode === settings.dateMode,
    )
    if (other.length) {
        output.push(...other)
    }
    return output
}
