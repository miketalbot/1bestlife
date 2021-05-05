import { useRefresh } from '../lib/hooks'
import { PropertyBox } from '../lib/PropertyBox'
import { Number } from '../lib/text-input'
import React from 'react'

export function WeeklyEditor({ settings }) {
    const refresh = useRefresh()
    settings.weekTimes = settings.weekTimes || 1
    return (
        <PropertyBox>
            <Number
                label="Times Per Week"
                value={settings.weekTimes}
                onChangeText={value => {
                    settings.weekTimes = +value
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
