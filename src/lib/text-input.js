import React from 'react'
import { TextInput } from 'react-native-paper'
import styled from 'styled-components/native'

const InputContainer = styled.View`
    flex-direction: row;
`
const Input = styled.TextInput`
    flex: 1;
`
const AdornmentContainer = styled.View`
    align-items: center;
    justify-content: center;
    padding: 0 10px;
`

export function TextInputAdorned({ left, right, ...props }) {
    return (
        <TextInput
            {...props}
            render={inputProps => (
                <InputContainer>
                    {left && <AdornmentContainer>{left}</AdornmentContainer>}
                    <Input {...inputProps} />
                    {right && <AdornmentContainer>{right}</AdornmentContainer>}
                </InputContainer>
            )}
        />
    )
}
