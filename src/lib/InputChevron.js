import { Box } from '../components/Theme'
import { Icon } from './icons'
import { palette } from '../config/palette'
import React from 'react'

export function InputChevron({ ...props }) {
    return [
        <Box flexGrow={1} key="spacer" />,
        <Box p="m" {...props} key="chevron">
            <Icon
                size={16}
                icon="chevron-right"
                color={palette.all.app.accent}
            />
        </Box>,
    ]
}
