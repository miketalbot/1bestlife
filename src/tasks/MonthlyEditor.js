import { useRefresh } from '../lib/hooks'
import { mode, useModes } from '../lib/modes'
import { PropertyBox } from '../lib/PropertyBox'
import { Number } from '../lib/text-input'
import React from 'react'
import { Text } from 'react-native'
import { Box } from '../components/Theme'
import { ListEditor } from './ListEditor'

function Rotated({ children, style }) {
    return (
        <Box style={{ transform: [{ rotate: `90deg` }] }}>
            <Text numberOfLines={1} style={[{ width: 28 }, style]}>
                {children}
            </Text>
        </Box>
    )
}

export function MonthlyEditor({ settings }) {
    const refresh = useRefresh()
    settings.months = settings.months || {
        jan: true,
        feb: true,
        mar: true,
        apr: true,
        may: true,
        jun: true,
        jul: true,
        aug: true,
        sep: true,
        oct: true,
        nov: true,
        dec: true,
    }
    const months = useModes(
        {
            jan: mode(
                ({ style }) => <Rotated style={style}>Jan</Rotated>,
                update,
            ),
            feb: mode(
                ({ style }) => <Rotated style={style}>Feb</Rotated>,
                update,
            ),
            mar: mode(
                ({ style }) => <Rotated style={style}>Mar</Rotated>,
                update,
            ),
            apr: mode(
                ({ style }) => <Rotated style={style}>Apr</Rotated>,
                update,
            ),
            may: mode(
                ({ style }) => <Rotated style={style}>May</Rotated>,
                update,
            ),
            jun: mode(
                ({ style }) => <Rotated style={style}>Jun</Rotated>,
                update,
            ),
            jul: mode(
                ({ style }) => <Rotated style={style}>Jul</Rotated>,
                update,
            ),
            aug: mode(
                ({ style }) => <Rotated style={style}>Aug</Rotated>,
                update,
            ),
            sep: mode(
                ({ style }) => <Rotated style={style}>Sep</Rotated>,
                update,
            ),
            oct: mode(
                ({ style }) => <Rotated style={style}>Oct</Rotated>,
                update,
            ),
            nov: mode(
                ({ style }) => <Rotated style={style}>Nov</Rotated>,
                update,
            ),
            dec: mode(
                ({ style }) => <Rotated style={style}>Dec</Rotated>,
                update,
            ),
        },
        settings.months,
    )
    settings.monthTimes = settings.monthTimes ?? 1
    settings.habitSettings = settings.habitSettings || {}
    return (
        <PropertyBox>
            {months}
            <Number
                label="Times Per Month"
                value={settings.monthTimes}
                onChangeText={value => {
                    settings.monthTimes = +value
                    refresh()
                }}
            />
            <ListEditor
                label="Habit List"
                group="habitGroups"
                groupLabel="Habit Lists"
                settings={settings.habitSettings}
            />
        </PropertyBox>
    )

    function update(value) {
        settings.months[value] = !settings.months[value]
        refresh()
    }
}
