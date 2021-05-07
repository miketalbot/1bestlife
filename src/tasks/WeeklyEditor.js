import { useRefresh } from '../lib/hooks'
import { PropertyBox } from '../lib/PropertyBox'
import { Number } from '../lib/text-input'
import React from 'react'
import { ListEditor } from './ListEditor'

export function WeeklyEditor({ settings }) {
    const refresh = useRefresh()
    settings.weekTimes = settings.weekTimes ?? 1
    settings.habitSettings = settings.habitSettings || {}
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
            <ListEditor
                label="Habit List"
                group="habitGroups"
                groupLabel="Habit Lists"
                settings={settings.habitSettings}
            />
        </PropertyBox>
    )

    function update(value) {
        settings.days[value] = !settings.days[value]
        refresh()
    }
}
