import React, { useState } from 'react'
import { TextInput } from 'react-native-paper'
import { Box, Text } from 'components/Theme'
import { CategorySelector } from './CategorySelector'
import { categories } from './types/categories'

export function CategoryInput({ value, onChange = () => {} }) {
    const [category, internalSetCategory] = useState(value)
    return (
        <TextInput
            label="Category"
            value={category}
            render={() => (
                <Box mt="l" pb="s" pl="xs" pr="xs">
                    <CategorySelector
                        mustSelect
                        category={category}
                        onChange={setCategory}
                    />
                    <Box flexDirection="row" justifyContent="space-around">
                        <Text variant="body">
                            {categories[category]?.caption ?? ''}
                        </Text>
                    </Box>
                </Box>
            )}
        />
    )

    function setCategory(value) {
        internalSetCategory(value)
        onChange(value)
    }
}
