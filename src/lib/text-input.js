import React, { useCallback, useEffect, useRef, useState } from 'react'
import { TextInput } from 'react-native-paper'
import styled from 'styled-components/native'
import debounce from 'lodash-es/debounce'
import { StyleSheet, View } from 'react-native'
import { IconButton } from './icons'
import { palette } from '../config/palette'
import { Box } from '../components/Theme'

export const InputContainer = styled.View`
    flex-direction: row;
    align-items: center;
`
export const Input = styled.TextInput`
    flex: 1;
`
export const AdornmentContainer = styled.View`
    align-items: center;
    justify-content: center;
    padding: 0 10px;
`

const styles = StyleSheet.create({
    helperText: {
        fontSize: 12,
    },
    numberInput: {
        fontSize: 24,
        color: palette.all.app.color,
        textAlign: 'center',
    },
})

export function Number({
    minimum = 0,
    maximum,
    Component = Input,
    value,
    onChangeText = () => {},
    ...props
}) {
    return (
        <View>
            <TextInput
                value={`${value}`}
                onChangeText={change}
                {...props}
                render={inputProps => {
                    return (
                        <Box
                            flexDirection="row"
                            mt="l"
                            pl="xs"
                            pr="xs"
                            alignItems="center">
                            <Box flexGrow={1} />
                            <AdornmentContainer>
                                <IconButton
                                    onPress={decrement}
                                    color={palette.all.app.accent}
                                    icon="minus"
                                />
                            </AdornmentContainer>
                            <Component
                                {...inputProps}
                                style={styles.numberInput}
                            />
                            <AdornmentContainer>
                                <IconButton
                                    onPress={increment}
                                    color={palette.all.app.accent}
                                    icon="plus"
                                />
                            </AdornmentContainer>
                            <Box flexGrow={1} />
                        </Box>
                    )
                }}
            />
        </View>
    )
    function increment() {
        change(+value + 1)
    }

    function decrement() {
        change(+value - 1)
    }

    function change(value) {
        value = +value
        if (value < minimum || isNaN(value)) {
            value = minimum
        }
        if (value > maximum) {
            value = maximum
        }
        onChangeText(`${value}`)
    }
}

export function TextInputAdorned({
    left,
    right,
    Component = Input,
    helperText,
    ...props
}) {
    return (
        <View>
            <TextInput
                {...props}
                render={inputProps => (
                    <InputContainer>
                        {left && (
                            <AdornmentContainer>{left}</AdornmentContainer>
                        )}
                        <Component {...inputProps} />
                        {right && (
                            <AdornmentContainer>{right}</AdornmentContainer>
                        )}
                    </InputContainer>
                )}
            />
            <View style={styles.helperText}>{helperText || null}</View>
        </View>
    )
}

export function TextInputDebounced({
    ms = 600,
    value,
    onChangeText = () => {},
    ...props
}) {
    const [edit, setValue] = useState(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const update = useCallback(debounce(notify, ms), [notify, ms])
    const currentValue = useRef()
    currentValue.current = edit
    useEffect(() => {
        setValue(value)
    }, [value])
    return (
        <TextInputAdorned
            value={edit}
            onChangeText={immediateUpdate}
            {...props}
        />
    )

    function immediateUpdate(editedValue) {
        setValue(editedValue)
        update()
    }

    function notify() {
        onChangeText(currentValue.current)
    }
}
