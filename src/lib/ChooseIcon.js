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
import { useRefreshWhen } from './hooks'
import { palette } from 'config/palette'
import Sugar from 'sugar'
import { raiseLater } from './local-events'
import { FullWidthPressable } from './FullWidthPressable'

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
})

const IconChooser = React.forwardRef(function IconChooser(
    { value, onChange },
    ref,
) {
    return (
        <FullWidthPressable onPress={showChooser}>
            <Box ref={ref} mt="m" mb="s" alignItems="center" width="100%">
                <Icon icon={value} size={64} color="white" />
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
        const selectedIcon = useRef(value)
        const [search, setSearch] = useState('')
        const icons = useMemo(() => {
            let basicList = iconSet
                .filter(i => i.includes(search.toLowerCase()))
                .sort()
            return basicList.inGroupsOf(3)
        }, [search])
        return (
            <Page
                footer={
                    <Box mt="s" mb="s" pl="l" pr="l">
                        <Button onPress={choose} mode="contained">
                            Choose
                        </Button>
                    </Box>
                }>
                <TextInputDebounced
                    label="Search"
                    right={<Icon color="white" size={20} icon="search" />}
                    value={search}
                    onChangeText={setSearch}
                />
                <FlatList
                    data={icons}
                    style={{ flex: 1 }}
                    keyExtractor={(item, index) => item[0] || index || ''}
                    renderItem={({ item: group }) => {
                        return (
                            <Box
                                flexDirection="row"
                                justifyContent="space-around"
                                alignItems="center">
                                {group.map(icon => {
                                    return (
                                        <SelectableIcon
                                            key={icon}
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
            onChange(selectedIcon.current)
            navigation.goBack()
        }

        function SelectableIcon({ icon }) {
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
        }
    },
    { options: { headerTitle: 'Choose Icon' } },
)
