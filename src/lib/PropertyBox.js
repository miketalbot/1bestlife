import { Box } from '../components/Theme'
import React from 'react'

export function PropertyBox({ children, spacing = 's', ...props }) {
    return (
        <Box {...props}>
            {React.Children.toArray(children).map(child => (
                <Box key={child.key} mb={spacing}>
                    {child}
                </Box>
            ))}
        </Box>
    )
}
