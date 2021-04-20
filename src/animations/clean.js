import React from 'react'
import LottieView from 'lottie-react-native'

export function clean(item) {
    recurseClean(item)
    return item
}

function recurseClean(item) {
    for (let [key, value] of Object.entries(item)) {
        if (key === 'bm' && value > 15) {
            item.bm = 0
        } else if (Array.isArray(value)) {
            for (let subItem of value) {
                recurseClean(subItem)
            }
        } else if (typeof value === 'object' && value) {
            recurseClean(value)
        }
    }
}

export function Lottie({ source, ...props }) {
    return <LottieView source={clean(source)} {...props} />
}
