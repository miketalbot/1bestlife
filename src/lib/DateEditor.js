import { palette } from '../config/palette'
import { Box, Text } from '../components/Theme'
import React, { useState } from 'react'
import { addScreen } from './screens'
import { Page } from './page'
import { Button } from 'react-native-paper'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import Sugar from 'sugar'
import { setFromEvent } from './set-from-event'
import { If } from './switch'
import { mode, useModes } from './modes'

export const DateEditor = addScreen(
    function DateEditor({
        navigation,
        route: {
            params: { settings, refresh = () => {} },
        },
    }) {
        const [date, setDate] = useState(settings.byWhen)
        const [dateMode, setMode] = useState(settings.dateMode || 'by')
        const items = useModes(
            {
                by: mode('By', update),
                before: mode('Before', update),
                at: mode('At', update),
            },
            dateMode,
        )
        return (
            <Page
                footer={
                    <Box mt="s" mb="s" pl="l" pr="l">
                        <Button onPress={configure} mode="contained">
                            Choose
                        </Button>
                    </Box>
                }>
                <Box p="s">{items}</Box>
                <Box p="s">
                    <RNDateTimePicker
                        minimumDate={Sugar.Date.beginningOfDay(
                            Sugar.Date.create(),
                        )}
                        textColor={palette.all.app.color}
                        display="spinner"
                        onChange={setFromEvent(setDate)}
                        value={date}
                    />
                </Box>
                <If truthy={dateMode !== 'by'}>
                    <Box p="s">
                        <Box alignItems="center">
                            <Text variant="label">Time</Text>
                        </Box>
                        <RNDateTimePicker
                            minuteInterval={5}
                            textColor={palette.all.app.color}
                            display="spinner"
                            mode="time"
                            value={date}
                            onChange={setFromEvent(setDate)}
                            minimumDate={Sugar.Date.create()}
                        />
                    </Box>
                </If>
            </Page>
        )

        function update(value) {
            setMode(value)
        }

        function configure() {
            settings.dateMode = dateMode
            settings.byWhen = date
            refresh()
            navigation.goBack()
        }
    },
    { options: { headerTitle: 'Choose Date' } },
)
