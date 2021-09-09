import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import { Keyboard, ScrollView, StyleSheet, View } from 'react-native'
import { palette } from '../config/palette'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Settings } from './SettingsContext'
import { PropertyBox } from './PropertyBox'
import { Box, ListItemBox } from '../components/Theme'
import { Button } from 'react-native-paper'
import { useCurrentState } from './hooks'

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
    close: {
        backgroundColor: palette.all.app.darkPanel,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
})

const ScrollerContext = createContext()

export function ScrollingPage({ children, ...props }) {
    const ref = useRef()
    return (
        <ScrollerContext.Provider value={ref}>
            <Page {...props}>
                <ScrollView
                    onScroll={e =>
                        (ref.current.scrollTop = e.nativeEvent.contentOffset.y)
                    }
                    ref={ref}
                    keyboardShouldPersistTaps="handled">
                    <PropertyBox pt="xs" pl="s" pr="s" width="100%">
                        {children}
                    </PropertyBox>
                </ScrollView>
            </Page>
        </ScrollerContext.Provider>
    )
}

export function Page({
    children,
    footer,
    style: baseStyle,
    settings,
    refresh,
    commit,
    ...props
}) {
    const scroller = useContext(ScrollerContext)
    const [height, setHeight] = useCurrentState(0)
    const [footerHeight, setFooterHeight] = useState(0)
    const insets = useSafeAreaInsets()
    const safeArea = useMemo(() => {
        return {
            height: insets.bottom,
            backgroundColor: palette.all.app.backgroundColor,
        }
    }, [insets.bottom])
    const currentFocus = useRef()
    const style = useMemo(() => {
        return { height }
    }, [height])
    const footerStyle = useMemo(() => {
        return { height: footerHeight }
    }, [footerHeight])
    useEffect(() => {
        // Keyboard.addListener('keyboardWillShow', shown)
        Keyboard.addListener('keyboardDidShow', shown)
        Keyboard.addListener('keyboardDidHide', hidden)
        Keyboard.addListener('keyboardWillHide', hidden)
        return () => {
            // Keyboard.removeListener('keyboardWillShow', shown)
            Keyboard.removeListener('keyboardDidShow', shown)
            Keyboard.removeListener('keyboardDidHide', hidden)
            Keyboard.removeListener('keyboardWillHide', hidden)
        }
    }, [])
    return (
        <Settings settings={settings} refresh={refresh} commit={commit}>
            <View onFocus={focus} {...props} style={[styles.page, baseStyle]}>
                {children}
                {height !== 0 && <View style={{ height: 40 }} />}
                <View style={style} />
                <View style={footerStyle} />
                {height === 0 && <View style={safeArea} />}
                {!!footer && (
                    <View pointerEvents="box-none" style={[styles.overlay]}>
                        <View
                            pointerEvents="box-none"
                            style={{ flexGrow: 1 }}
                        />
                        <View
                            pointerEvents="auto"
                            onLayout={updateFooter}
                            style={styles.footer}>
                            {footer}
                        </View>
                        {height !== 0 && (
                            <View pointerEvents="auto">
                                <ListItemBox
                                    onPress={dismiss}
                                    style={styles.close}>
                                    <Box flex={1} />
                                    <Button onPress={dismiss}>Done</Button>
                                </ListItemBox>
                            </View>
                        )}

                        <View style={style} />
                        {height === 0 && <View style={safeArea} />}
                    </View>
                )}
            </View>
        </Settings>
    )

    function dismiss() {
        Keyboard.dismiss()
    }

    function updateFooter({
        nativeEvent: {
            layout: { height },
        },
    }) {
        setFooterHeight(height)
    }

    function focus(e) {
        currentFocus.current = e.target
        if (height) {
            scroll()
        }
    }

    function shown({ endCoordinates: { height } }) {
        setHeight(height)
        scroll()
    }

    function scroll() {
        currentFocus.current?.measure((x, y, width, height, pageX, pageY) => {
            if (!scroller?.current) return
            pageY += scroller.current.scrollTop || 0
            scroller.current.scrollTo({
                y: Math.max(0, pageY + y - height * 2 - 50),
                animated: true,
            })
        })
    }

    function hidden() {
        setHeight(0)
    }
}
