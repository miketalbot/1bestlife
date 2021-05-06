import { StyleSheet, TouchableOpacity } from 'react-native'
import { theme } from '../lib/paper-theme'
import { palette } from '../config/palette'
import Sugar from 'sugar'
import React from 'react'
import { ToggleBox, ToggleGroup } from '../lib/toggle-button'
import { Box, Text } from '../components/Theme'
import { Icon } from '../lib/icons'
import { DateEditor } from '../lib/DateEditor'
import { useRefresh } from '../lib/hooks'
import { ListEditor } from './ListEditor'
import { useDirty } from '../lib/dirty'

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
        color: palette.all.app.mutedColor,
        borderColor: palette.all.app.mutedColor,
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
    const formattedDate = Sugar.Date.format(
        Sugar.Date.create(settings.byWhen),
        settings.dateMode !== 'by' ? '{short} {time}' : '{medium}',
    )
    const [mode, setMode] = dirty.useState(settings.mode || 'asap')
    settings.mode = mode
    const asapStyles =
        mode === 'asap' ? todoStyles.selected : todoStyles.standard
    const byStyles = mode === 'by' ? todoStyles.selected : todoStyles.standard
    let by = Sugar.String.titleize(settings.dateMode || 'by')
    if (by === 'By') {
        by = 'By the end of'
    }
    return (
        <Box width="100%">
            <ToggleGroup mb="s">
                <ToggleBox
                    height={100}
                    selected={mode === 'asap'}
                    onPress={() => setMode('asap')}>
                    <Box
                        width="100%"
                        flexGrow={1}
                        alignItems="center"
                        justifyContent="space-around">
                        <Text style={asapStyles}>Soon</Text>
                    </Box>
                </ToggleBox>
                <ToggleBox
                    p="s"
                    height={100}
                    flexDirection="column"
                    justifyContent="space-around"
                    selected={mode === 'by'}
                    onPress={() => setMode('by')}>
                    <Box flexGrow={1} />
                    <Box alignItems="center">
                        <Text style={byStyles}>{by}</Text>
                    </Box>
                    <TouchableOpacity onPress={chooseDate}>
                        <Box
                            mt="s"
                            style={[byStyles, todoStyles.date]}
                            flexDirection="row"
                            alignItems="center">
                            <Text style={byStyles}>{formattedDate}</Text>
                            <Box flexGrow={1} />
                            <Box ml="s">
                                <Icon
                                    icon="chevron-right"
                                    style={byStyles}
                                    size={12}
                                />
                            </Box>
                        </Box>
                    </TouchableOpacity>
                </ToggleBox>
            </ToggleGroup>
            {!!showListEditor && <ListEditor />}
        </Box>
    )

    function chooseDate() {
        setMode('by')
        DateEditor.navigate({ settings, refresh: dirty.makeDirty(refresh) })
    }
}
