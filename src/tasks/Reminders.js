import { TextInput } from 'react-native-paper'
import { Box, Text } from 'components/Theme'
import { Icon } from 'lib/icons'
import { palette } from 'config/palette'
import React from 'react'
import { FullWidthPressable } from '../lib/FullWidthPressable'
import { ReminderConfiguration } from './ReminderConfiguration'

export function Reminders({ settings }) {
    const reminders = getReminders(settings)
    return (
        <TextInput
            label="Reminders"
            value={reminders}
            render={({ value }) => {
                return (
                    <FullWidthPressable onPress={configure}>
                        <Box
                            mt="l"
                            pt="s"
                            pl="input"
                            flexDirection="row"
                            alignItems="center">
                            <Box>
                                <Text variant="body">{value}</Text>
                            </Box>
                            <Box flexGrow={1} />
                            <Box pr="s">
                                <Icon
                                    size={16}
                                    icon="chevron-right"
                                    color={palette.all.app.accent}
                                />
                            </Box>
                        </Box>
                    </FullWidthPressable>
                )
            }}
        />
    )

    function configure() {
        ReminderConfiguration.navigate({ settings })
    }
}

function getReminders(settings) {
    return '(Standard reminders)'
}
