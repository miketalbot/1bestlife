import { StyleSheet } from 'react-native'
import { palette } from '../config/palette'
import { useDirty } from '../lib/dirty'
import React, { useRef } from 'react'
import { CustomTextInput } from '../lib/CustomTextInput'
import { Box, ListItemBox } from '../components/Theme'
import { ToggleBox, ToggleGroup } from '../lib/toggle-button'
import { Icon, IconButton } from '../lib/icons'
import { Input } from '../lib/text-input'

const timerStyles = StyleSheet.create({
    input: {
        color: palette.all.app.color,
        fontSize: 24,
        flex: 5,
        textAlign: 'center',
    },
    disabled: {
        color: palette.all.app.mutedColor,
    },
})
const multiples = [
    30,
    30,
    30,
    30,
    30,
    60,
    60,
    60,
    60,
    60,
    60,
    60,
    60,
    60,
    60,
    60,
    60,
    300,
    300,
    300,
    300,
    300,
    300,
    300,
    600,
    600,
    600,
    600,
    600,
    600,
    600,
    600,
    600,
    1800,
]

export function TimedTask({ settings }) {
    settings.timed = settings.timed ?? false
    const dirty = useDirty()
    const timer = useRef()
    const increment = useRef(0)
    const [time, setTime] = dirty.useState(settings.time ?? 30000)
    const [editTime, setEditTime] = dirty.useState(makeTime(time))
    settings.time = time
    if (settings.cannotBeTimed) return null
    return (
        <>
            <CustomTextInput label="Timed Task" value="x">
                <ListItemBox mt="s" pr="s" mb="s">
                    <ToggleGroup>
                        <ToggleBox
                            selected={settings.timed}
                            p="s"
                            style={{
                                width: 42,
                                borderColor: settings.timed
                                    ? palette.all.app.accent
                                    : palette.all.app.inputBorder,
                            }}
                            onPress={toggleTimer}>
                            <Box justifyContent="space-around" mt="xs">
                                <Icon
                                    color={
                                        settings.timed
                                            ? palette.all.app.darkColor
                                            : palette.all.app.accent
                                    }
                                    icon="stopwatch-20"
                                />
                            </Box>
                        </ToggleBox>
                        <ToggleBox
                            flex={1}
                            p="s"
                            style={{
                                borderLeftWidth: 0,
                                borderColor: settings.timed
                                    ? palette.all.app.accent
                                    : palette.all.app.inputBorder,
                            }}>
                            <Box flex={0.2} />
                            <Box>
                                <IconButton
                                    disabled={!settings.timed}
                                    onPress={minus}
                                    icon="minus"
                                    color={
                                        settings.timed
                                            ? palette.all.app.accent
                                            : palette.all.app.mutedColor
                                    }
                                    size={24}
                                />
                            </Box>
                            <Box flex={0.1} />
                            <Input
                                keyboardType={'numeric'}
                                editable={!!settings.timed}
                                style={[
                                    timerStyles.input,
                                    !settings.timed && timerStyles.disabled,
                                ]}
                                value={editTime}
                                onChangeText={setEditTime}
                                onBlur={updateTime}
                            />
                            <Box flex={0.1} />
                            <Box>
                                <IconButton
                                    disabled={!settings.timed}
                                    icon="plus"
                                    onPress={plus}
                                    color={
                                        settings.timed
                                            ? palette.all.app.accent
                                            : palette.all.app.mutedColor
                                    }
                                    size={24}
                                />
                            </Box>
                            <Box flex={0.2} />
                        </ToggleBox>
                    </ToggleGroup>
                </ListItemBox>
            </CustomTextInput>
        </>
    )

    function updateTime() {
        let currentTime = processTime(editTime)
        setTime(currentTime)
        setEditTime(makeTime(currentTime))
        return currentTime
    }

    function plus() {
        clearTimeout(timer.current)
        timer.current = setTimeout(() => (increment.current = 0), 500)
        let updatedTime = clampTime(
            updateTime() +
                1000 *
                    multiples[
                        Math.min(multiples.length - 1, increment.current)
                    ],
        )
        setTime(updatedTime)
        increment.current++
        setEditTime(makeTime(updatedTime))
    }

    function minus() {
        clearTimeout(timer.current)
        timer.current = setTimeout(() => (increment.current = 0), 500)
        let updatedTime = clampTime(
            updateTime() -
                1000 *
                    multiples[
                        Math.min(multiples.length - 1, increment.current)
                    ],
        )
        setTime(updatedTime)
        increment.current++
        setEditTime(makeTime(updatedTime))
    }

    function clampTime(time) {
        return Math.max(0, Math.min(1000 * 60 * 60 * 24, time))
    }

    function makeTime(value) {
        value = value / 1000
        return `${Math.floor(value / 60)}.${`00${value % 60}`.slice(-2)}`
    }

    function processTime(v = '') {
        let [minutes, seconds] = v.split('.')
        if (seconds === undefined) {
            seconds = minutes
            minutes = 0
        }
        let result = (+minutes * 60 + +seconds) * 1000
        if (isNaN(result)) return time
        return result
    }

    function toggleTimer() {
        settings.timed = !settings.timed
        dirty.makeDirty()
        dirty.refresh()
    }
}
