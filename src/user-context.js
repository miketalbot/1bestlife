import React, { useContext, useEffect, useRef, useState } from 'react'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { raise, useLocalEvent } from './lib/local-events'
import merge from 'lodash-es/merge'
import { cloneDeep as clone, isEqual } from 'lodash-es'
import { ensureArray } from './lib/ensure-array'
import { typeDef } from './tasks/register-task'

export const UserContext = React.createContext()

let userRecord = null

export function User({ children }) {
    const [user, setUser] = useState()
    const [hasUserRecord, setUserRecord] = useState(false)
    const unsubscribe = useRef()
    const currentUser = useRef()
    useLocalEvent('user-data-updated', function (record) {
        setUserRecord(!!record)
    })
    currentUser.current = user
    useEffect(() => {
        auth().onAuthStateChanged(updateAuthState)
        return () => {
            if (unsubscribe.current) {
                unsubscribe.current()
            }
        }

        async function updateAuthState(loggedInUser) {
            if (!loggedInUser) {
                auth().signInAnonymously().catch(console.error)
            } else {
                if (unsubscribe.current) {
                    unsubscribe.current()
                }
                unsubscribe.current = firestore()
                    .collection('Users')
                    .doc(loggedInUser.uid)
                    .onSnapshot(updateUser)
                currentUser.current = loggedInUser
                setUser(loggedInUser)
            }
        }

        function updateUser(userData) {
            if (!userData.exists) {
                userData = { created: Date.now() }
                return firestore()
                    .collection('Users')
                    .doc(currentUser.current.uid)
                    .set(userData)
            }
            userRecord = userData.data()
            raise('user-data-updated', userRecord)
        }
    }, [])

    return !user || !hasUserRecord ? null : (
        <UserContext.Provider value={user}>{children}</UserContext.Provider>
    )
}

export function useUser() {
    const [user, setUser] = useState(userRecord)
    const loggedInUser = useContext(UserContext)
    useLocalEvent('user-data-updated', newUser => {
        setUser(newUser)
    })
    const result = {
        id() {
            return loggedInUser.uid
        },
        using(fn) {
            const toUpdate = clone(user)
            let callResult = fn(toUpdate)
            if (callResult?.then) {
                return callResult.then(asyncResult => {
                    update()
                    return asyncResult
                })
            } else {
                update()
                return callResult
            }

            function update() {
                if (!isEqual(user, toUpdate)) {
                    merge(user, toUpdate)
                    result.save()
                }
            }
        },
        completeTask(task) {
            let completed = (user.tasksCompleted = user.tasksCompleted || {})
            completed[task.id] = new Date()
            const def = typeDef(task)
            if (def.then) {
                for (let then of ensureArray(def.then)) {
                    then(user, task, def)
                }
            }
            return result.save()
        },
        save(additionalData = {}) {
            Object.assign(user, additionalData)
            return firestore()
                .collection('Users')
                .doc(loggedInUser.uid)
                .set(user)
        },
    }
    Object.setPrototypeOf(user, result)
    return user
}
