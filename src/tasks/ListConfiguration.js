import { addScreen } from '../lib/screens'
import { ScrollingPage } from '../lib/page'
import React, { useEffect } from 'react'
import { addDebugger } from '../lib/DebuggerView'
import { Box, Text } from '../components/Theme'
import { Button } from 'react-native-paper'
import { Icon } from '../lib/icons'
import { palette } from '../config/palette'
import { FullWidthPressable } from '../lib/FullWidthPressable'
import { useRefresh } from '../lib/hooks'
import { useUser } from '../user-context'
import { InputChevron } from '../lib/InputChevron'
import { uid } from '../lib/uid'
import { ListEdit } from './ListEdit'
import { Checkbox } from '../lib/Checkbox'
import { TouchableWithoutFeedback } from 'react-native'

export const ListConfiguration = addScreen(
    function ListConfiguration({
        route: {
            params: { settings, refresh: parentRefresh },
        },
    }) {
        const user = useUser()
        useEffect(() => {
            if (!user.lists) {
                user.using(() => {
                    user.lists = user.lists || []
                })
            }
        }, [user])
        const refresh = useRefresh()

        const lists = user.lists || []
        return (
            <ScrollingPage settings={settings} refresh={refresh}>
                <Box mt="m">
                    <Text variant="label">To Do Lists</Text>
                </Box>
                <Box mt="s" width="100%">
                    {lists.map(list => {
                        const { id, icon, name } = list
                        return (
                            <Box
                                key={id}
                                mb="m"
                                width="100%"
                                flexDirection="row"
                                alignItems="center">
                                <FullWidthPressable
                                    Component={TouchableWithoutFeedback}
                                    onPress={flip}>
                                    <Box mr="s">
                                        <Checkbox
                                            value={settings.listId === id}
                                            onChanged={flip}
                                        />
                                    </Box>
                                    <Box mr="s">
                                        <Icon
                                            color={palette.all.app.color}
                                            icon={icon}
                                        />
                                    </Box>
                                    <Box mr="s" flex={1}>
                                        <Text variant="body">{name}</Text>
                                    </Box>
                                </FullWidthPressable>
                                <Box>
                                    <FullWidthPressable onPress={edit(list)}>
                                        <InputChevron />
                                    </FullWidthPressable>
                                </Box>
                            </Box>
                        )

                        function flip() {
                            if (settings.listId === id) {
                                settings.listId = undefined
                            } else {
                                settings.listId = id
                                user.using(update => {
                                    update.lastListId = id
                                })
                            }
                            refresh()
                            parentRefresh()
                        }
                    })}
                </Box>
                <Button onPress={newList} mode="outlined">
                    + List
                </Button>
            </ScrollingPage>
        )

        function edit(list) {
            return function () {
                ListEdit.navigate({
                    isNew: false,
                    list,
                    addList,
                    deleteList,
                    settings,
                    refresh,
                })
            }
        }

        function newList() {
            ListEdit.navigate({
                isNew: true,
                list: { id: uid() },
                addList,
                settings,
                refresh,
            })
        }

        async function deleteList(list) {
            await user.using(user => {
                console.log('LOG>>>', list.id, user.lists.map('id').join(','))
                user.lists = user.lists.filter(l => l.id !== list.id)
                console.log('LOG>>> after', user.lists.map('id').join(','))
            })
            refresh()
        }

        async function addList(list) {
            await user.using(user => {
                user.lists.push(list)
            })
            refresh()
        }
    },
    {
        options: { headerTitle: 'Lists' },
    },
)

addDebugger('Lists', () => {
    ListConfiguration.navigate({
        settings: { type: 'todo', dateMode: 'by' },
        refresh: () => {},
    })
})
