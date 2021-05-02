import { usePalette } from '../config/palette'
import React, { useEffect, useMemo, useState } from 'react'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated'
import { mix } from 'react-native-redash'
import { raise, useLocalEvent } from '../lib/local-events'
import { typeDef } from './register-task'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { ColorBar } from '../lib/ColorBar'
import { SelectableLine } from '../SelectableLine'
import { Task } from './task'
import { Mounted } from '../lib/Mounted'
import { Icon } from '../lib/icons'

function defer(fn) {
    return (...params) => setTimeout(() => fn(...params))
}

const noOvershoot = {
    overshootClamping: true,
}

const taskListItemStyles = StyleSheet.create({
    absolute: {
        position: 'absolute',
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'stretch',
        width: '95%',
        marginBottom: 4,
    },
    taskItemTitle: {
        fontSize: 16,
        fontWeight: '400',
    },
    icon: {
        alignItems: 'center',
        width: 50,
        marginRight: 2,
    },
    expander: {
        marginRight: 4,
    },
    spacer: {
        flexGrow: 1,
    },
    selected: {
        paddingTop: 16,
    },
    taskHolder: {
        overflow: 'hidden',
        marginTop: -4,
        marginBottom: 4,
    },
})

export function TaskListItem({ task }) {
    const taskDef = typeDef(task.type)
    const [styles] = usePalette()
    const itemStyles = useMemo(() => {
        return [
            {
                backgroundColor: `${taskDef.color}15`,
                marginTop: -4,
                paddingBottom: 4,
            },
            taskListItemStyles.selected,
            {
                shadowColor: `${taskDef.color}A0`,
                shadowOpacity: 0.8,
                shadowRadius: 35,
            },
        ]
    }, [taskDef.color])
    const shadowStyle = useMemo(() => {
        return {
            shadowColor: `${taskDef.color}C0`,
            shadowOpacity: 1,
            shadowRadius: 13,
        }
    }, [taskDef.color])
    const [userExpanded, setExpanded] = useState(task.expanded)
    const [touched, setTouched] = useState(false)
    const open = useSharedValue(0)
    const animated = useAnimatedStyle(() => {
        return {
            opacity: mix(open.value, 0.5, 1),
            transform: [{ rotate: `${mix(open.value, 0, Math.PI / 2)}rad` }],
        }
    })
    useLocalEvent(
        'expand',
        defer(expandedTask => {
            if (task.id !== expandedTask.id) {
                setExpanded(false)
            }
        }),
    )
    const expanded = userExpanded || taskDef.alwaysExpanded
    useEffect(() => {
        open.value = withSpring(expanded ? 1 : 0)
    }, [expanded, open.value])
    return (
        <View>
            <Pressable
                style={shadowStyle}
                onPress={toggle}
                onPressIn={() => setTouched(true)}
                onPressOut={() => setTouched(false)}>
                <View style={[taskListItemStyles.taskItem]}>
                    <ColorBar
                        color={taskDef.color}
                        selected={expanded}
                        pressed={touched}
                    />
                    <SelectableLine color={taskDef.color}>
                        <View style={[taskListItemStyles.icon]}>
                            {task.icon || taskDef.icon ? (
                                <Icon
                                    color="white"
                                    icon={task.icon || taskDef.icon}
                                />
                            ) : null}
                        </View>
                        <View>
                            <Text
                                style={[
                                    styles.text,
                                    taskListItemStyles.taskItemTitle,
                                ]}>
                                {task.title || taskDef.title}
                            </Text>
                        </View>
                        <View style={taskListItemStyles.spacer} />
                        <Animated.View
                            style={[animated, taskListItemStyles.expander]}>
                            <Icon icon="chevron-right" color="#fff" />
                        </Animated.View>
                    </SelectableLine>
                </View>
            </Pressable>
            <Mounted springConfig={noOvershoot}>
                {expanded && (
                    <View style={styles.taskHolder}>
                        <View style={itemStyles}>
                            <Task key={task.id} task={task} />
                        </View>
                    </View>
                )}
            </Mounted>
        </View>
    )

    function toggle() {
        setExpanded(current => {
            if (!current) {
                raise('expand', task)
            }
            return !current
        })
    }
}
