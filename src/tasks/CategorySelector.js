import React, { useState } from 'react'
import { Box } from '../components/Theme'
import { Pressable } from 'react-native'
import { Icon } from '../lib/icons'
import { palette } from '../config/palette'
import { categories } from './types/categories'

export function CategorySelector({ category = '', onChange = () => {} }) {
    const [currentCategory, setCurrentCategory] = useState(category)
    return (
        <Box mt="m" flexDirection="row" justifyContent="space-evenly">
            {Object.entries(categories).map(([name, definition]) => {
                return (
                    <Pressable key={name} onPress={setCategory}>
                        <Box
                            borderRadius="s"
                            alignItems="center"
                            justifyContent="space-around"
                            width={40}
                            height={40}
                            style={{
                                backgroundColor: `${definition.color}${
                                    currentCategory === name ? 'FF' : 'C0'
                                }`,
                            }}>
                            <Icon color="white" icon={definition.icon} />
                        </Box>
                        {currentCategory === name && (
                            <Box
                                position="absolute"
                                bottom={-7}
                                width={40}
                                height={3}
                                style={{
                                    backgroundColor: palette.all.app.accent,
                                }}
                            />
                        )}
                    </Pressable>
                )

                function setCategory() {
                    setCurrentCategory(current => {
                        let result = current === name ? '' : name
                        onChange(result)
                        return result
                    })
                }
            })}
        </Box>
    )
}
