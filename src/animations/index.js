import React from 'react'
import { Lottie } from './clean'

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
    return <Lottie loop={true} source={require('./tick.json')} {...props} />
}
