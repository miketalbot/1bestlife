import { Box } from '../components/Theme'
import React from 'react'

export function FooterButtons({ children, ...props }) {
    return (
        <Box
            mt="s"
            mb="s"
            pl="l"
            pr="l"
            width="100%"
            flexDirection="row"
            alignItems="center"
            {...props}>
            {children}
        </Box>
    )
}
