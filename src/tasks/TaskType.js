import React, { useState } from 'react'
import { ToggleButton, ToggleGroup } from '../lib/toggle-button'

export function TaskType({ value, onChange = () => {} }) {
    const [type, internalSetType] = useState(value)
    return (
        <ToggleGroup>
            <ToggleButton
                icon="check"
                selected={type === 'todo'}
                onPress={() => setType('todo')}
                mode="outlined">
                Task
            </ToggleButton>
            <ToggleButton
                icon="calendar"
                selected={type === 'daily'}
                onPress={() => setType('daily')}
                mode="outlined">
                Daily
            </ToggleButton>
            <ToggleButton
                icon="calendar-week"
                selected={type === 'weekly'}
                onPress={() => setType('weekly')}
                mode="outlined">
                Weekly
            </ToggleButton>
            <ToggleButton
                icon="calendar-alt"
                selected={type === 'monthly'}
                onPress={() => setType('monthly')}
                mode="outlined">
                Monthly
            </ToggleButton>
        </ToggleGroup>
    )

    function setType(value) {
        internalSetType(value)
        onChange(value)
    }
}
