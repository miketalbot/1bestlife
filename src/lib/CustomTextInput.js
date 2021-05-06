import { TextInput } from 'react-native-paper'
import { Box } from '../components/Theme'
import { FullWidthPressable } from './FullWidthPressable'
import React, { Fragment } from 'react'

export function CustomTextInput({
    children,
    label,
    onPress,
    value,
    render = () => null,
    onChangeText,
    ...props
}) {
    const contents = (
        <TextInput
            style={{ width: '100%' }}
            {...props}
            label={label}
            value={value}
            onChangeText={onChangeText}
            render={(...props) => (
                <Box
                    mt="l"
                    pt="s"
                    pl="input"
                    flexDirection="row"
                    alignItems="center">
                    <Fragment key="rendered">{render(...props)}</Fragment>
                    <Fragment key="children">{children}</Fragment>
                </Box>
            )}
        />
    )
    return onPress ? (
        <FullWidthPressable onPress={onPress}>{contents}</FullWidthPressable>
    ) : (
        contents
    )
}
