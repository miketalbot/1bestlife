import { addScreen } from 'lib/screens'
import { ScrollingPage } from 'lib/page'
import { Box, Text } from 'components/Theme'
import { Button } from 'react-native-paper'
import React, { useEffect, useRef, useState } from 'react'
import { useRefresh } from '../lib/hooks'
import { FooterButtons } from '../lib/FooterButtons'
import { IconInput } from '../lib/ChooseIcon'
import { TextInputAdorned } from '../lib/text-input'
import { useUser } from '../user-context'
import clone from 'lodash-es/clone'
import { TodoEditor } from './TodoEditor'
import { useDirty } from '../lib/dirty'

export const ListEdit = addScreen(
    function ListEdit({
        navigation,
        route: {
            params: {
                due,
                list,
                isNew,
                addList,
                deleteList,
                refresh: parentRefresh,
            },
        },
    }) {
        const refresh = useRefresh()
        const dirty = useDirty()
        dirty.useAlert(setList)
        const loaded = useRef(false)
        useEffect(() => {
            loaded.current = true
        }, [])
        const [name, setName] = dirty.useState(list.name || '')
        const [icon, setIcon] = dirty.useState(
            list.icon || 'clipboard-list-check',
        )
        const [motivation, setMotivation] = dirty.useState(list.motivation)
        const [settings] = useState(clone(list.settings || {}))
        const user = useUser()
        return (
            <dirty.Provider>
                <ScrollingPage
                    footer={
                        <FooterButtons>
                            <Box width="66%" flexGrow={1}>
                                <Button
                                    disabled={name.length < 2}
                                    onPress={setList}
                                    mode="contained">
                                    {isNew ? 'Add List' : 'Update List'}
                                </Button>
                            </Box>

                            {!!deleteList && (
                                <Box width="34%" ml="s">
                                    <Button
                                        style={{
                                            backgroundColor: 'red',
                                            color: 'white',
                                        }}
                                        onPress={remove}
                                        dark
                                        mode="contained">
                                        Remove
                                    </Button>
                                </Box>
                            )}
                        </FooterButtons>
                    }>
                    <TextInputAdorned
                        autoFocus={!loaded.current}
                        label="Name"
                        value={name}
                        onChangeText={setName}
                    />
                    <IconInput value={icon} onChange={setIcon} />
                    <TextInputAdorned
                        multiline
                        label="Motivation"
                        value={motivation}
                        onChangeText={setMotivation}
                    />
                    {!!due && (
                        <Box mt="m">
                            <Text variant="label">Complete the list</Text>
                        </Box>
                    )}

                    {!!due && (
                        <TodoEditor
                            settings={settings}
                            showListEditor={false}
                        />
                    )}
                </ScrollingPage>
            </dirty.Provider>
        )

        function remove() {
            dirty.clean()
            deleteList(list)
            refresh()
            navigation.goBack()
        }

        function setList() {
            dirty.clean()
            list.name = name.trim()
            list.icon = icon
            list.settings = settings
            list.motivation = motivation
            if (isNew) {
                addList(list)
            } else {
                user.using(user => {
                    let current = user.lists.find(l => l.id === list.id)
                    Object.assign(current, list)
                })
                user.save()
            }
            parentRefresh()
            navigation.goBack()
        }
    },
    {
        options({
            route: {
                params: { isNew },
            },
        }) {
            return { headerTitle: isNew ? 'New List' : 'Edit List' }
        },
    },
)
