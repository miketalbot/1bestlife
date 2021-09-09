import { Box, Text } from '../components/Theme'
import Picker from '@gregfrench/react-native-wheel-picker'
import { palette } from '../config/palette'
import { range } from './range'
import React, { useEffect, useState } from 'react'
import { addScreen } from './screens'
import { Page } from './page'
import { Button } from 'react-native-paper'

export function DurationPicker({
    value: initialValue,
    onChange = () => {},
    ...props
}) {
    const value = initialValue / 1000
    const [hours, setHours] = useState(Math.floor(value / 3600))
    const [minutes, setMinutes] = useState(Math.floor(value / 60) % 60)
    const [seconds, setSeconds] = useState(
        Math.floor((Math.floor(value) % 60) / 5) * 5,
    )
    const time = seconds + minutes * 60 + hours * 3600
    useEffect(() => {
        if (time !== value) {
            console.log(time, hours, minutes, seconds)
            onChange(time * 1000)
        }
    }, [time, value])

    return (
        <Page {...props}>
            <Box flexDirection="row" alignItems="center" pt="l">
                <Box width="33.3%">
                    <Box alignItems="center">
                        <Text variant="label">Hours</Text>
                    </Box>
                    <Picker
                        itemStyle={{ color: palette.all.app.color }}
                        style={{ width: '100%', height: 180 }}
                        onValueChange={setHours}
                        selectedValue={hours}
                        lineColor={palette.all.app.mutedColor}>
                        {range(0, 23).map(r => (
                            <Picker.Item key={r} label={`${r}`} value={r} />
                        ))}
                    </Picker>
                </Box>
                <Box width="33.3%">
                    <Box alignItems="center">
                        <Text variant="label">Minutes</Text>
                    </Box>
                    <Picker
                        itemStyle={{ color: palette.all.app.color }}
                        style={{ width: '100%', height: 180 }}
                        onValueChange={setMinutes}
                        selectedValue={minutes}
                        lineColor={palette.all.app.mutedColor}>
                        {range(0, 60).map(r => (
                            <Picker.Item
                                key={r}
                                label={`00${r}`.slice(-2)}
                                value={r}
                            />
                        ))}
                    </Picker>
                </Box>
                <Box width="33.3%">
                    <Box alignItems="center">
                        <Text variant="label">Seconds</Text>
                    </Box>

                    <Picker
                        itemStyle={{ color: palette.all.app.color }}
                        style={{ width: '100%', height: 180 }}
                        onValueChange={r => {
                            console.log(r)
                            setSeconds(r)
                        }}
                        selectedValue={seconds}
                        lineColor={palette.all.app.mutedColor}>
                        {range(0, 12).map(r => (
                            <Picker.Item
                                key={r}
                                label={`00${r * 5}`.slice(-2)}
                                value={r * 5}
                            />
                        ))}
                    </Picker>
                </Box>
            </Box>
        </Page>
    )
}

export const DurationScreen = addScreen(
    function Duration({
        navigation,
        route: {
            params: { value, onChange },
        },
    }) {
        return (
            <DurationPicker
                value={value}
                onChange={onChange}
                footer={
                    <Box mt="s" mb="s" pl="l" pr="l">
                        <Button
                            onPress={() => navigation.goBack()}
                            mode="contained">
                            Done
                        </Button>
                    </Box>
                }
            />
        )
    },
    { options: { headerTitle: 'Duration' } },
)
