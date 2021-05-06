import React, { useContext } from 'react'

const SettingsContext = React.createContext({})

export function useSettings() {
    return useContext(SettingsContext)
}

export function Settings({ settings, refresh, commit, children }) {
    const currentContext = useContext(SettingsContext)
    settings = settings || currentContext.settings
    refresh =
        refresh ||
        currentContext.refresh ||
        (() => console.error('No refresh available'))
    commit =
        commit ||
        currentContext.commit ||
        (() => console.error('No commit available'))
    return (
        <SettingsContext.Provider value={{ settings, refresh, commit }}>
            {children}
        </SettingsContext.Provider>
    )
}
