import React, { useContext } from 'react'
import { ensureArray } from '../ensure-array'
import noop from '../noop'

const SwitchContext = React.createContext()

export function Switch({ value, children }) {
    return (
        <SwitchContext.Provider value={{ value, cases: {} }}>
            {children}
        </SwitchContext.Provider>
    )
}

export function If({ value, truthy, field, children, equals, not, ...props }) {
    value = value || truthy
    props.then = props.then || children
    let condition = equals ? value === equals : !!value
    return not
        ? !condition
            ? props.then || null
            : props.else || null
        : condition
        ? props.then || null
        : props.else || null
}

export function Case({ when, children, execute = noop }) {
    const toCheck = ensureArray(when)
    const { value, cases } = useContext(SwitchContext)
    let condition = toCheck.some(whenCondition => {
        if (typeof whenCondition === 'function') {
            return whenCondition(value)
        } else {
            return whenCondition === value
        }
    })

    cases['' + when] = condition
    if (condition) {
        execute()
        return <>{children}</>
    } else {
        return null
    }
}

export function CaseElse({ children }) {
    const { cases } = useContext(SwitchContext)
    if (!Object.values(cases).some(v => !!v)) {
        return <>{children}</>
    }
    return null
}
