import React, { useEffect, useState } from 'react'
import { Box } from 'components/Theme'
import { Dimensions, Pressable } from 'react-native'
import { Icon } from 'lib/icons'
import { palette } from 'config/palette'
import { categories } from './types/categories'

export function CategorySelector({
    category = '',
    has = () => true,
    mustSelect,
    onChange = () => {},
}) {
    const [currentCategory, setCurrentCategory] = useState(category)
    const buttonSize = Math.floor((Dimensions.get('window').width - 50) / 9)
    useEffect(() => {
        if ((!category || !has(category)) && mustSelect) {
            const updatedCategory = Object.keys(categories).find(name =>
                has(name),
            )
            setCurrentCategory(updatedCategory)
            onChange(updatedCategory)
        }
    }, [category, mustSelect, onChange, has])
    return (
        <Box mt="s" mb="m" flexDirection="row" justifyContent="space-evenly">
            {Object.entries(categories).map(([name, definition]) => {
                return (
                    <Pressable key={name} onPress={setCategory}>
                        <Box
                            borderRadius="s"
                            alignItems="center"
                            justifyContent="space-around"
                            width={buttonSize}
                            height={buttonSize}
                            style={{
                                backgroundColor: `${definition.color}${
                                    currentCategory === name
                                        ? 'FF'
                                        : has(name)
                                        ? 'C0'
                                        : '00'
                                }`,
                            }}>
                            <Icon color="white" icon={definition.icon} />
                        </Box>
                        {currentCategory === name && (
                            <Box
                                position="absolute"
                                bottom={-7}
                                width={buttonSize}
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
                        let result =
                            current === name ? (mustSelect ? name : '') : name
                        onChange(result)
                        return result
                    })
                }
            })}
        </Box>
    )
}
