import React, { useMemo, useRef, useState } from 'react'
import {
    FlatList,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from 'react-native'
import { Box, Text } from 'components/Theme'
import { Icon, icons as iconSet } from './icons'
import { addScreen } from './screens'
import { Page } from './page'
import { Button } from 'react-native-paper'
import { TextInputAdorned, TextInputDebounced } from './text-input'
import { palette } from 'config/palette'
import { FullWidthPressable } from './FullWidthPressable'
import { useRefreshWhen } from './hooks'
import { raiseLater } from './local-events'
import Sugar from 'sugar'
import { FooterButtons } from './FooterButtons'
import { useUser } from '../user-context'
import { useDirty } from './dirty'

export function IconInput({ value, onChange, ...props }) {
    return (
        <TextInputAdorned
            label="Icon"
            Component={IconChooser}
            value={value}
            onChange={onChange}
        />
    )
}

const styles = StyleSheet.create({
    more: {
        color: palette.all.app.accent,
        flexDirection: 'row',
        position: 'absolute',
        left: 54,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    recent: {
        position: 'absolute',
        bottom: 0,
        right: -16,
    },
})

const IconChooser = React.forwardRef(function IconChooser(
    { value, onChange },
    ref,
) {
    return (
        <FullWidthPressable onPress={showChooser}>
            <Box ref={ref} mt="m" mb="s" alignItems="center" width="100%">
                <Icon icon={value} size={56} color="white" />
                <View>
                    <View style={styles.more}>
                        <Text variant="action">Change</Text>
                        <Icon
                            icon="chevron-right"
                            size={12}
                            color={palette.all.app.accent}
                        />
                    </View>
                </View>
            </Box>
        </FullWidthPressable>
    )

    function showChooser() {
        ChooseIcon.navigate({ value, onChange })
    }
})
const ChooseIcon = addScreen(
    function ChooseIcon({
        navigation,
        route: {
            params: { value, onChange },
        },
    }) {
        const user = useUser()
        const dirty = useDirty()
        dirty.useAlert()
        user.recentIcons = user.recentIcons || []
        const selectedIcon = useRef(value)
        const [search, setSearch] = useState('')
        const [icons, recent] = useMemo(() => {
            let recentIconSet = new Set(user.recentIcons)
            const recentList = user.recentIcons.filter(i =>
                i.includes(search.toLowerCase()),
            )
            let basicList = iconSet
                .filter(
                    i =>
                        i.includes(search.toLowerCase()) &&
                        !recentIconSet.has(i),
                )
                .sort()
            return [[...recentList, ...basicList].inGroupsOf(3), recentIconSet]
        }, [search])
        return (
            <Page
                footer={
                    <FooterButtons>
                        <Box flex={1}>
                            <Button onPress={choose} mode="contained">
                                Choose
                            </Button>
                        </Box>
                    </FooterButtons>
                }>
                <TextInputDebounced
                    label="Search"
                    right={<Icon color="white" size={20} icon="search" />}
                    value={search}
                    onChangeText={setSearch}
                />
                <FlatList
                    keyboardShouldPersistTaps="handled"
                    data={icons}
                    style={{ flex: 1 }}
                    keyExtractor={(item, index) => item[0] || index || ''}
                    renderItem={({ item: group }) => {
                        return (
                            <Box
                                flexDirection="row"
                                justifyContent="space-around"
                                alignItems="center">
                                {group.map((icon, index) => {
                                    return (
                                        <SelectableIcon
                                            recent={recent.has(icon)}
                                            key={icon || index}
                                            icon={icon}
                                        />
                                    )
                                })}
                            </Box>
                        )
                    }}
                />
            </Page>
        )

        function choose() {
            dirty.clean()
            user.recentIcons = [selectedIcon.current, ...user.recentIcons]
                .unique()
                .slice(0, 12)
            user.save()
            onChange(selectedIcon.current)
            navigation.goBack()
        }

        function SelectableIcon({ icon, recent }) {
            useRefreshWhen(`changed.icon.${icon}`)
            return (
                !!icon && (
                    <TouchableWithoutFeedback onPress={() => setCurrent(icon)}>
                        <Box mt="s" mb="s" alignItems="center" width={'33%'}>
                            <Box mb="s">
                                <Icon
                                    icon={icon}
                                    size={48}
                                    color={
                                        icon === selectedIcon.current
                                            ? palette.all.app.accent
                                            : palette.all.app.color
                                    }
                                />
                                {recent && (
                                    <Box style={styles.recent}>
                                        <Icon
                                            icon="clock"
                                            size={12}
                                            color={palette.all.app.mutedColor}
                                        />
                                    </Box>
                                )}
                            </Box>
                            <Text variant="iconTitle">
                                {Sugar.String.titleize(icon)}
                            </Text>
                        </Box>
                    </TouchableWithoutFeedback>
                )
            )
        }

        function setCurrent(icon) {
            const existing = selectedIcon.current
            selectedIcon.current = icon
            raiseLater(`changed.icon.${icon}`)
            raiseLater(`changed.icon.${existing}`)
            dirty.makeDirty()
        }
    },
    { options: { headerTitle: 'Choose Icon' } },
)
