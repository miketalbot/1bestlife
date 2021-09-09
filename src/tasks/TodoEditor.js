import { StyleSheet, TouchableOpacity } from 'react-native'
import { theme } from '../lib/paper-theme'
import { palette } from '../config/palette'
import Sugar from 'sugar'
import React from 'react'
import { ToggleBox, ToggleButton, ToggleGroup } from '../lib/toggle-button'
import { Box, ListItemBox, Text } from '../components/Theme'
import { Icon } from '../lib/icons'
import { DateEditor } from '../lib/DateEditor'
import { useRefresh } from '../lib/hooks'
import { ListEditor } from './ListEditor'
import { useDirty } from '../lib/dirty'
import { CustomTextInput } from '../lib/CustomTextInput'

const todoStyles = StyleSheet.create({
    date: {
        padding: 4,
        borderRadius: theme.roundness,
        borderWidth: 1,
    },
    selected: {
        color: palette.all.app.darkColor,
        borderColor: palette.all.app.darkColor,
    },
    standard: {
        color: palette.all.app.accent,
        borderColor: palette.all.app.mutedColor,
    },
    notSelected: {
        color: palette.all.app.mutedColor,
    },
    deadlineRelative: {
        color: palette.all.app.mutedColor,
        fontSize: 12,
    },
})

export function TodoEditor({
    settings,
    showListEditor = true,
    dirty: parentDirty,
}) {
    const refresh = useRefresh()
    const dirty = useDirty(parentDirty)
    settings.byWhen = settings.byWhen || Sugar.Date.create('next week')
    settings.dateMode = settings.dateMode || 'by'
    settings.todoSettings = settings.todoSettings || {}
    const [mode, setMode] = dirty.useState(settings.mode || 'asap')
    if (mode === 'by') {
        settings.dateMode = 'at'
    } else {
        if (settings.dateMode === 'at') {
            settings.dateMode = 'by'
        }
    }
    const formattedDate = Sugar.Date.format(
        Sugar.Date.create(settings.byWhen),
        settings.dateMode !== 'by' ? '{short} {time}' : '{medium}',
    )

    const [deadline, setDeadline] = dirty.useState(settings.deadline || false)
    settings.deadline = deadline
    settings.mode = mode
    const hasADeadline = settings.deadline || mode === 'by'
    const byStyles = hasADeadline ? todoStyles.standard : todoStyles.notSelected
    let by = Sugar.String.titleize(settings.dateMode || 'by')
    if (by === 'By') {
        by = 'By the end of'
    }
    if (by === 'At') {
        by = ''
    }
    return (
        <Box width="100%">
            <ToggleGroup mb="xs">
                <ToggleButton
                    mode="outlined"
                    onPress={() => setMode('asap')}
                    selected={mode === 'asap'}>
                    Task
                </ToggleButton>
                <ToggleButton
                    mode="outlined"
                    onPress={() => setMode('by')}
                    selected={mode === 'by'}>
                    Appointment
                </ToggleButton>
                <ToggleButton
                    mode="outlined"
                    onPress={() => setMode('oneday')}
                    selected={mode === 'oneday'}>
                    Bucket List
                </ToggleButton>
            </ToggleGroup>
            {mode === 'by' || mode === 'asap' ? (
                <Box mb="xs">
                    <CustomTextInput
                        label={mode === 'by' ? 'Date' : 'Deadline'}
                        value="x">
                        <Box pb="s" width="100%">
                            <ToggleGroup mb="s" mt="s" pr="s">
                                <ToggleBox
                                    selected={hasADeadline}
                                    p="s"
                                    style={{
                                        width: 42,
                                        borderColor: hasADeadline
                                            ? palette.all.app.accent
                                            : palette.all.app.inputBorder,
                                    }}
                                    onPress={() =>
                                        mode === 'asap' &&
                                        setDeadline(!settings.deadline)
                                    }>
                                    <Box justifyContent="space-around" mt="xs">
                                        <Icon
                                            color={
                                                hasADeadline
                                                    ? palette.all.app.darkColor
                                                    : palette.all.app.accent
                                            }
                                            icon="calendar-plus"
                                        />
                                    </Box>
                                </ToggleBox>

                                <ToggleBox
                                    flex={1}
                                    p="s"
                                    style={{
                                        borderLeftWidth: 0,
                                        borderColor: hasADeadline
                                            ? palette.all.app.accent
                                            : palette.all.app.inputBorder,
                                    }}>
                                    <TouchableOpacity onPress={chooseDate}>
                                        <Box
                                            mt="s"
                                            style={[byStyles]}
                                            flexDirection="row"
                                            alignItems="center">
                                            {hasADeadline ? (
                                                <Text style={byStyles}>
                                                    {by} {formattedDate}
                                                </Text>
                                            ) : (
                                                <Text style={byStyles}>
                                                    No deadline
                                                </Text>
                                            )}

                                            <Box flexGrow={1} />
                                        </Box>
                                    </TouchableOpacity>
                                </ToggleBox>
                            </ToggleGroup>
                            {hasADeadline && (
                                <ListItemBox width="100%" pr="m">
                                    <Box flex={1} />
                                    <Text style={todoStyles.deadlineRelative}>
                                        Around{' '}
                                        {Sugar.Date.relative(
                                            Sugar.Date.create(
                                                settings.byWhen,
                                            ).endOfDay(),
                                        )}
                                    </Text>
                                </ListItemBox>
                            )}
                        </Box>
                    </CustomTextInput>
                </Box>
            ) : null}
            {!!showListEditor && (
                <ListEditor
                    label="To Do List"
                    due={true}
                    group="lists"
                    settings={settings.todoSettings}
                />
            )}
        </Box>
    )

    function chooseDate() {
        if (!hasADeadline) return
        DateEditor.navigate({ settings, refresh: dirty.makeDirty(refresh) })
    }
}
