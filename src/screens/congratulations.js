import React, { useContext, useEffect } from 'react'
import { OverlayContext, setOverlay } from '../Overlay'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import noop from '../lib/noop'

let congratulationsId = 0

export function congratulations({
    name,
    badge,
    background,
    onCompleted,
    delay = 300,
    ...props
}) {
    setTimeout(() => {
        setOverlay(
            <Congratulations
                {...props}
                id={`congrats${congratulationsId}`}
                key={`congrats${congratulationsId++}`}
                name={name}
                badge={badge}
                background={background}
                onCompleted={onCompleted}
            />,
        )
    }, delay)
}

const styles = StyleSheet.create({
    notificationPanel: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: Dimensions.get('window').height,
        width: '100%',
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#000000D0',
    },
    notification: {
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '200',
        color: '#444',
    },
    body: {
        fontSize: 32,
        fontWeight: '200',
        color: '#fff',
    },
    tick: {
        width: 80,
        height: 80,
    },
    message: {
        marginLeft: 14,
        alignItems: 'center',
    },
    background: {
        opacity: 0.7,
    },
    badge: {
        marginBottom: 24,
    },
})

function Congratulations({
    name,
    time = 15000,
    id,
    badge,
    background,
    onCompleted = noop,
}) {
    const { close } = useContext(OverlayContext)
    useEffect(() => {
        setTimeout(() => {
            close(id)
            onCompleted(id)
        }, time)
    }, [close, id, time, onCompleted])
    return (
        <View style={styles.notificationPanel}>
            <View style={styles.background}>{background}</View>

            <View style={styles.notification}>
                <View style={styles.message}>
                    <View style={styles.badge}>{badge}</View>
                    <Text style={styles.body}>{name}</Text>
                </View>
            </View>
        </View>
    )
}

export function willCongratulate({
    name,
    icon,
    animation,
    onCompleted,
    ...props
}) {
    return function () {
        congratulations({ name, icon, animation, onCompleted, ...props })
    }
}
