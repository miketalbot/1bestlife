import { useUser } from '../user-context'
import { usePalette } from '../config/palette'
import { Text } from 'react-native'
import React from 'react'

export function WelcomeMessage() {
    const user = useUser()
    const [styles] = usePalette()
    return (
        <Text style={styles.title}>
            {user.name ? `Hi ${user.name}!` : 'Welcome!'}
        </Text>
    )
}
