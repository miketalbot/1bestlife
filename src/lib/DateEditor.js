import { palette } from '../config/palette'
import { Box, Text } from '../components/Theme'
import React from 'react'
import { addScreen } from './screens'
import { Page } from './page'
import { Button } from 'react-native-paper'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import Sugar from 'sugar'
import { convertToDate, setFromEvent } from './set-from-event'
import { If } from './switch'
import { mode, useModes } from './modes'
import { useDirty } from './dirty'

export const DateEditor = addScreen(
    function DateEditor({
        navigation,
        route: {
            params: { settings, refresh = () => {} },
        },
    }) {
        const dirty = useDirty()
        dirty.useAlert(configure)
        const [date, setDate] = dirty.useState(settings.byWhen || new Date())
        const [dateMode, setMode] = dirty.useState(settings.dateMode || 'by')
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
                        onChange={setFromEvent(convertToDate(setDate))}
                        value={new Date(date)}
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
                            value={new Date(date)}
                            onChange={setFromEvent(convertToDate(setDate))}
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
            dirty.clean()
            settings.dateMode = dateMode
            settings.byWhen = 0 + +date
            refresh()
            navigation.goBack()
        }
    },
    { options: { headerTitle: 'Choose Date' } },
)
