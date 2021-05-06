import { useSettings } from '../lib/SettingsContext'
import { useUser } from '../user-context'
import { useRefresh } from '../lib/hooks'
import { CustomTextInput } from '../lib/CustomTextInput'
import { Box, ListItemBox, Text } from '../components/Theme'
import { Icon, IconButton } from '../lib/icons'
import { palette } from '../config/palette'
import { InputChevron } from '../lib/InputChevron'
import { ListConfiguration } from './ListConfiguration'
import React from 'react'
import { Button } from 'react-native-paper'

export function ListEditor() {
    const { settings } = useSettings()
    const { lists = [], lastListId } = useUser()
    const currentList = lists.find(item => item.id === settings.listId)
    if (!currentList) {
        settings.listId = undefined
    }
    const lastList = lists.find(item => item.id === lastListId)
    const refresh = useRefresh()
    return (
        <CustomTextInput onPress={showLists} label="List" value={'true'}>
            <Box mb="m" flexDirection="row" alignItems="center" width="100%">
                {!settings.listId && (
                    <ListItemBox flex={1} minWidth="70%" maxWidth="70%">
                        <Text variant="muted">No List</Text>
                        {!!lastList && (
                            <Box ml="xl" flexGrow={1}>
                                <Button
                                    onPress={useLastList}
                                    mode="outlined"
                                    icon={lastList.icon}>
                                    <Box flexGrow={1}>
                                        <Text
                                            numberOfLines={1}
                                            variant="buttonCaption">
                                            Add to "{lastList.name}"
                                        </Text>
                                    </Box>
                                </Button>
                            </Box>
                        )}
                    </ListItemBox>
                )}
                {!!currentList && (
                    <Box flexDirection="row" alignItems="center" flex={4}>
                        <Box mr="s">
                            <Icon
                                color={palette.all.app.color}
                                icon={currentList.icon}
                            />
                        </Box>
                        <Box mr="s" flexGrow={1}>
                            <Text variant="body">{currentList.name}</Text>
                        </Box>
                        <Box ml="m">
                            <IconButton
                                color={palette.all.app.accent}
                                size={16}
                                icon="times"
                                onPress={clearList}
                            />
                        </Box>
                    </Box>
                )}
                <InputChevron />
            </Box>
        </CustomTextInput>
    )

    function clearList() {
        settings.listId = undefined
        refresh()
    }

    function useLastList() {
        settings.listId = lastList.id
        refresh()
    }

    function showLists() {
        ListConfiguration.navigate({
            settings,
            refresh,
        })
    }
}
