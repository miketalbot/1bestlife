import { Box } from '../components/Theme'
import React from 'react'

export function PropertyBox({ children, spacing = 's', ...props }) {
    let list = React.Children.toArray(children)
    return (
        <Box {...props}>
            {list.map((child, index) => (
                <Box
                    key={child.key}
                    mb={index !== list.length - 1 ? spacing : undefined}>
                    {child}
                </Box>
            ))}
        </Box>
    )
}
