import React, { useCallback, useEffect, useRef, useState } from 'react'
import { TextInput } from 'react-native-paper'
import styled from 'styled-components/native'
import debounce from 'lodash-es/debounce'
import { StyleSheet, View } from 'react-native'

export const InputContainer = styled.View`
    flex-direction: row;
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
})

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
