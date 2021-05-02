import React, { useContext, useEffect } from 'react'
import { OverlayContext, setOverlay } from '../Overlay'
import { StyleSheet, Text, View } from 'react-native'
import { TickAlt } from '../animations'
import noop from '../lib/noop'

let completedId = 0

export function completed({
    name,
    icon,
    animation,
    onCompleted,
    delay = 500,
    ...props
}) {
    setTimeout(() => {
        setOverlay(
            <Completed
                {...props}
                id={`completed${completedId}`}
                key={`completed${completedId++}`}
                name={name}
                icon={icon}
                animation={animation}
                onCompleted={onCompleted}
            />,
        )
    }, delay)
}

const styles = StyleSheet.create({
    notificationPanel: {
        position: 'absolute',
        top: 90,
        left: 16,
        right: 16,
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#FFFFFFE0',
    },
    notification: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '200',
        color: '#444',
    },
    body: {
        fontSize: 16,
        fontWeight: '400',
        color: '#444',
    },
    tick: {
        width: 80,
        height: 80,
    },
    message: {
        marginLeft: 14,
    },
})

function Completed({ name, time = 5000, id, onCompleted = noop }) {
    const { close } = useContext(OverlayContext)
    useEffect(() => {
        setTimeout(() => {
            close(id)
            onCompleted(id)
        }, time)
    }, [close, id, time, onCompleted])
    return (
        <View style={styles.notificationPanel}>
            <View style={styles.notification}>
                <View>
                    <TickAlt style={styles.tick} />
                </View>
                <View style={styles.message}>
                    <Text style={styles.title}>Completed</Text>
                    <Text style={styles.body}>{name}</Text>
                </View>
            </View>
        </View>
    )
}

export function willComplete({ name, icon, animation, onCompleted, ...props }) {
    return function () {
        completed({ name, icon, animation, onCompleted, ...props })
    }
}
