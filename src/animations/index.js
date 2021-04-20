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
