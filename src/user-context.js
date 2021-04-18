import React, {useContext, useEffect, useRef, useState} from 'react'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import {raise, useLocalEvent} from './lib/local-events'

export const UserContext = React.createContext()

let userRecord = null

export function User({children}) {
  const [user, setUser] = useState()
  const unsubscribe = useRef()
  const currentUser = useRef()
  currentUser.current = user
  useEffect(() => {
    auth().onAuthStateChanged(updateAuthState)
    return () => {
      if (unsubscribe.current) {
        unsubscribe.current()
      }
    }
  }, [])

  return !user ? null : (
    <UserContext.Provider value={user}>{children}</UserContext.Provider>
  )

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
      userData = {created: Date.now()}
      return firestore()
        .collection('Users')
        .doc(currentUser.current.uid)
        .set(userData)
    }
    userRecord = userData.data()
    raise('user-data-updated', userRecord)
  }
}

export function useUser() {
  const [user, setUser] = useState(userRecord)
  const loggedInUser = useContext(UserContext)
  useLocalEvent('user-data-updated', () => {
    setUser(userRecord)
  })
  const result = {
    id() {
      return loggedInUser.uid
    },
    save(additionalData = {}) {
      return firestore()
        .collection('Users')
        .doc(loggedInUser.uid)
        .set({...user, ...additionalData})
    },
  }
  Object.setPrototypeOf(result, userRecord)
  return result
}
