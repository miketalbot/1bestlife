import { Box } from '../components/Theme'
import Picker from '@gregfrench/react-native-wheel-picker'
import { palette } from '../config/palette'
import { range } from './range'
import React from 'react'

export function BeforePicker({ value, onChange }) {
    return (
        <Box flexDirection="row" alignItems="center">
            <Box width="50%">
                <Picker
                    itemStyle={{ color: palette.all.app.color }}
                    style={{ width: '100%', height: 180 }}
                    onValueChange={setUnits}
                    selectedValue={value[0]}
                    lineColor={palette.all.app.mutedColor}>
                    {range(0, 90).map(r => (
                        <Picker.Item key={r} label={`${r}`} value={r} />
                    ))}
                </Picker>
            </Box>
            <Box width="50%">
                <Picker
                    itemStyle={{ color: palette.all.app.color }}
                    style={{ width: '100%', height: 180 }}
                    onValueChange={setReminderMode}
                    selectedValue={value[1]}
                    lineColor={palette.all.app.mutedColor}>
                    <Picker.Item key="m" label={'Minutes'} value={0} />
                    <Picker.Item key="h" label={'Hours'} value={1} />
                    <Picker.Item key="d" label={'Days'} value={2} />
                </Picker>
            </Box>
        </Box>
    )

    function setReminderMode(index) {
        onChange([value[0], index])
    }

    function setUnits(index) {
        onChange([index, value[1]])
    }
}
