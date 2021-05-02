import React from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import * as Icons from '@fortawesome/pro-solid-svg-icons'
import * as LightIcons from '@fortawesome/pro-light-svg-icons'

function addIcons(scanIcons) {
    const iconList = Object.keys(scanIcons)
        .filter(key => key !== scanIcons.prefix && key !== 'prefix')
        .map(icon => scanIcons[icon])

    library.add(...iconList)
}

addIcons(Icons)
addIcons(LightIcons)

export function Icon({ icon, light = true, name, ...props }) {
    return (
        <FontAwesomeIcon
            icon={[light ? 'fal' : 'fas', icon || name]}
            size={25}
            {...props}
        />
    )
}
