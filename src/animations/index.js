import React from 'react'
import { Lottie } from './clean'
import { Dimensions, StyleSheet } from 'react-native'

export function Smilie(props) {
    return (
        <Lottie
            loop={true}
            autoPlay={true}
            source={require('./smiley-emoji')}
            {...props}
        />
    )
}

export function StarStrike(props) {
    return (
        <Lottie
            loop={true}
            autoPlay={true}
            source={require('./star-strike.json')}
            {...props}
        />
    )
}

export function Tick(props) {
    return <Lottie loop={false} source={require('./tick.json')} {...props} />
}

const styles = StyleSheet.create({
    fireworks: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    default: {
        width: '100%',
        height: '100%',
    },
})

export function Fireworks(props) {
    return (
        <Lottie
            style={styles.fireworks}
            loop={true}
            source={require('./fireworks.json')}
            {...props}
        />
    )
}

export function StarBadge(props) {
    return (
        <Lottie
            style={styles.default}
            loop={true}
            steps={[
                { from: 0, to: 1 },
                { from: 0.99, to: 1, delay: 1000 },
                { from: 0.4, to: 1, then: 1 },
            ]}
            source={require('./star-badge.json')}
            {...props}
        />
    )
}

export function Celebration(props) {
    return (
        <Lottie
            style={styles.fireworks}
            loop={true}
            source={require('./celebration.json')}
            {...props}
        />
    )
}

export function TickAlt(props) {
    return (
        <Lottie loop={false} source={require('./tick-alt.json')} {...props} />
    )
}
