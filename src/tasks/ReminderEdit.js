import { addScreen } from 'lib/screens'
import { Page } from 'lib/page'
import { Box, Text } from 'components/Theme'
import { Button } from 'react-native-paper'
import { ScrollView } from 'react-native'
import { PropertyBox } from 'lib/PropertyBox'
import React, { Fragment, useState } from 'react'
import { BeforePicker } from '../lib/BeforePicker'
import { If } from '../lib/switch'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import { palette } from '../config/palette'
import { setFromEvent } from '../lib/set-from-event'
import Sugar from 'sugar'
import { mode, useModes } from '../lib/modes'
import { useRefresh } from '../lib/hooks'
import { range } from '../lib/range'
import { uid } from '../lib/uid'
import { FooterButtons } from '../lib/FooterButtons'

export const ReminderEdit = addScreen(
    function ReminderEdit({
        navigation,
        route: {
            params: {
                reminder,
                isNew,
                addReminder,
                deleteReminder,
                refresh: parentRefresh,
                settings: { type, dateMode },
            },
        },
    }) {
        const refresh = useRefresh()
        const [reminderTime, setReminderTime] = useState(
            reminder.time || new Date(),
        )
        const [reminderMode, setReminderMode] = useState(reminder.mode || 0)
        const [units, setUnits] = useState(reminder.units || 1)
        const [day] = useState(() => {
            return (
                reminder.day || {
                    mon: true,
                    tue: true,
                    wed: true,
                    thu: true,
                    fri: true,
                    sat: true,
                    sun: true,
                }
            )
        })
        const [monthDay] = useState(() => {
            return reminder.monthDay || { 28: true }
        })

        const days = useModes(
            {
                mon: mode('Mon', update),
                tue: mode('Tue', update),
                wed: mode('Wed', update),
                thu: mode('Thu', update),
                fri: mode('Fri', update),
                sat: mode('Sat', update),
                sun: mode('Sun', update),
            },
            day,
        )

        const monthDays1 = useModes(
            Sugar.Array.groupBy(
                range(1, 10),
                v => v,
                (__, v, group) =>
                    (group[v] = mode(`${v}`, () => {
                        monthDay[v] = !monthDay[v]
                        refresh()
                    })),
            ),
            monthDay,
        )
        const monthDays2 = useModes(
            Sugar.Array.groupBy(
                range(11, 20),
                v => v,
                (__, v, group) =>
                    (group[v] = mode(`${v}`, () => {
                        monthDay[v] = !monthDay[v]
                        refresh()
                    })),
            ),
            monthDay,
        )
        const monthDays3 = useModes(
            Sugar.Array.groupBy(
                range(21, 28),
                v => v,
                (__, v, group) =>
                    (group[v] = mode(`${v}`, () => {
                        monthDay[v] = !monthDay[v]
                        refresh()
                    })),
            ),
            monthDay,
            10,
        )

        return (
            <Page
                footer={
                    <FooterButtons>
                        <Box width="66%" flexGrow={1}>
                            <Button onPress={setReminder} mode="contained">
                                {isNew ? 'Add Reminder' : 'Update Reminder'}
                            </Button>
                        </Box>

                        {!!deleteReminder && (
                            <Box width="34%" ml="s">
                                <Button
                                    style={{
                                        backgroundColor: 'red',
                                        color: 'white',
                                    }}
                                    onPress={remove}
                                    dark
                                    mode="contained">
                                    Remove
                                </Button>
                            </Box>
                        )}
                    </FooterButtons>
                }>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <PropertyBox pt="s" pl="m" pr="m">
                        <If
                            truthy={
                                type === 'todo' &&
                                ['at', 'before'].includes(dateMode)
                            }
                            then={
                                <Fragment>
                                    <Box width="100%" alignItems="center">
                                        <Text variant="label">Before</Text>
                                    </Box>
                                    <BeforePicker
                                        value={[units, reminderMode]}
                                        onChange={([units, reminderMode]) => {
                                            setReminderMode(reminderMode)
                                            setUnits(units)
                                        }}
                                    />
                                </Fragment>
                            }
                            else={
                                <Fragment>
                                    <Box width="100%" alignItems="center">
                                        <Text variant="label">At</Text>
                                    </Box>
                                    <RNDateTimePicker
                                        textColor={palette.all.app.color}
                                        display="spinner"
                                        mode="time"
                                        onChange={setFromEvent(setReminderTime)}
                                        value={reminderTime}
                                    />
                                </Fragment>
                            }
                        />
                        <If truthy={type === 'weekly'}>{days}</If>
                        <If truthy={type === 'monthly'}>
                            <PropertyBox>
                                <Box width="100%" alignItems="center">
                                    <Text variant="label">
                                        Days of the Month
                                    </Text>
                                </Box>

                                {monthDays1}
                                {monthDays2}
                                {monthDays3}
                            </PropertyBox>
                        </If>
                    </PropertyBox>
                </ScrollView>
            </Page>
        )

        function remove() {
            deleteReminder(reminder)
            refresh()
            navigation.goBack()
        }

        function setReminder() {
            reminder.type = type
            reminder.dateMode = dateMode
            if (type === 'todo' && ['at', 'before'].includes(dateMode)) {
                reminder.units = units
                reminder.mode = reminderMode
                let type = ['minutes', 'hours', 'days'][reminderMode]
                if (units === 1) {
                    type = type.slice(0, -1)
                }
                reminder.description = `${units} ${type} before`
                reminder.icon = 'history'
            } else {
                reminder.icon = 'alarm-clock'
                reminder.time = reminderTime
                reminder.description = `At ${Sugar.Date.format(
                    reminderTime,
                    '{time}',
                )}`
            }
            if (type === 'weekly') {
                reminder.day = day
                if (Object.values(day).every(v => !v)) {
                    reminder.description = 'Not active'
                } else {
                    reminder.description =
                        reminder.description +
                        ' on ' +
                        Object.entries(day)
                            .filter(([, active]) => !!active)
                            .map('0')
                            .map(v => Sugar.String.titleize(v))
                            .join(', ')
                }
            }
            if (type === 'monthly') {
                reminder.monthDay = monthDay
                if (Object.values(monthDay).every(v => !v)) {
                    reminder.description = 'Not active'
                } else {
                    reminder.description =
                        reminder.description +
                        ' on ' +
                        Object.entries(monthDay)
                            .filter(([, active]) => !!active)
                            .map('0')
                            .map(v => Sugar.String.titleize(v))
                            .join(', ')
                }
            }
            if (isNew) {
                reminder.id = uid()
                addReminder(reminder)
            } else {
                parentRefresh()
            }
            navigation.goBack()
        }

        function update(value) {
            day[value] = !day[value]
            refresh()
        }
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
