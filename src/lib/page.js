import React, { useEffect, useMemo, useState } from 'react'
import { Keyboard, StyleSheet, View } from 'react-native'
import { palette } from '../config/palette'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const styles = StyleSheet.create({
    page: {
        backgroundColor: palette.all.app.backgroundColor,
        flex: 1,
    },
    grow: {
        flex: 1,
    },
    footer: {
        backgroundColor: palette.all.app.backgroundColor,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
})

export function Page({ children, footer, style: baseStyle, ...props }) {
    const [height, setHeight] = useState(0)
    const [footerHeight, setFooterHeight] = useState(0)
    const insets = useSafeAreaInsets()
    const safeArea = useMemo(() => {
        return {
            height: insets.bottom,
            backgroundColor: palette.all.app.backgroundColor,
        }
    }, [insets.bottom])
    const style = useMemo(() => {
        return { height }
    }, [height])
    const footerStyle = useMemo(() => {
        return { height: footerHeight }
    }, [footerHeight])
    useEffect(() => {
        Keyboard.addListener('keyboardWillShow', shown)
        Keyboard.addListener('keyboardDidShow', shown)
        Keyboard.addListener('keyboardDidHide', hidden)
        Keyboard.addListener('keyboardWillHide', hidden)
        return () => {
            Keyboard.removeListener('keyboardDidShow', shown)
            Keyboard.removeListener('keyboardWillShow', shown)
            Keyboard.removeListener('keyboardDidHide', hidden)
            Keyboard.removeListener('keyboardWillHide', hidden)
        }
    }, [])
    return (
        <View {...props} style={[styles.page, baseStyle]}>
            {children}
            <View style={style} />
            <View style={footerStyle} />
            {height === 0 && <View style={safeArea} />}
            {!!footer && (
                <View pointerEvents="box-none" style={[styles.overlay]}>
                    <View pointerEvents="box-none" style={{ flexGrow: 1 }} />
                    <View
                        pointerEvents="auto"
                        onLayout={updateFooter}
                        style={styles.footer}>
                        {footer}
                    </View>
                    <View style={style} />
                    {height === 0 && <View style={safeArea} />}
                </View>
            )}
        </View>
    )

    function updateFooter({
        nativeEvent: {
            layout: { height },
        },
    }) {
        setFooterHeight(height)
    }

    function shown({ endCoordinates: { height } }) {
        setHeight(height)
    }

    function hidden() {
        setHeight(0)
    }
}