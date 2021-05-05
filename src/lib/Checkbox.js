import { StyleSheet } from 'react-native'
import { palette } from '../config/palette'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import React from 'react'

const styles = StyleSheet.create({
    icon: { borderColor: palette.all.app.accent },
    selected: {
        color: palette.all.app.color,
        textDecorationLine: 'none',
    },
    standard: {
        color: palette.all.app.mutedColor,
        textDecorationLine: 'none',
    },
})

export function Checkbox({ value, text, onChanged = () => {} }) {
    return (
        <BouncyCheckbox
            iconStyle={styles.icon}
            textStyle={value ? styles.selected : styles.standard}
            isChecked={value}
            disableBuiltInState
            fillColor={palette.all.app.accent}
            unfillColor={palette.all.app.backgroundColor}
            text={text}
            onPress={() => onChanged(!value)}
        />
    )
}
