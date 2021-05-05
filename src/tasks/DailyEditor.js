import { useRefresh } from '../lib/hooks'
import { mode, useModes } from '../lib/modes'
import { PropertyBox } from '../lib/PropertyBox'
import React from 'react'
import { Number } from '../lib/text-input'

export function DailyEditor({ settings }) {
    const refresh = useRefresh()
    settings.days = settings.days || {
        mon: true,
        tue: true,
        wed: true,
        thu: true,
        fri: true,
        sat: true,
        sun: true,
    }
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
        settings.days,
    )
    settings.dayTimes = settings.dayTimes || 1
    return (
        <PropertyBox>
            {days}
            <Number
                label="Times Per Day"
                value={settings.dayTimes}
                onChangeText={value => {
                    settings.dayTimes = +value
                    refresh()
                }}
            />
        </PropertyBox>
    )

    function update(value) {
        settings.days[value] = !settings.days[value]
        refresh()
    }
}
