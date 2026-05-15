'use client'

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react"
import { IUser } from "@/interfaces/IUser"
import React from 'react'
import { useGlobalMessage } from "./globalMessageContext"
import { useRouter } from "@/i18n/navigation"

interface IUserContext {
    user: IUser | null,
    updateUser: (userObj: IUser | null) => void,
    logout: () => void,
    fetchUser: () => Promise<void>
}

const UserContext = createContext({} as IUserContext)

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<IUser | null>(null)
    const { setError } = useGlobalMessage()
    const router = useRouter()

    const updateUser = useCallback((userObj: IUser | null) => {
        setUser(userObj)
    }, [])

    const fetchUser = useCallback(async () => {
        try {
            const res = await fetch('/api/user', {
                method: 'GET',
                credentials: 'include'
            })
            if (!res.ok) {
                setUser(null)
                return
            }

            const data = await res.json()
            setUser(data.user ?? null)
        } catch (err) {
            console.error(err)
            setUser(null)
        }
    }, [])

    const logout = useCallback(async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            })
        } catch (err) {
            console.error(err)
        } finally {
            setUser(null)
            window.location.href = '/'
        }
    }, [router])

    useEffect(() => {
        fetchUser()
    }, [fetchUser])

    return (
        <UserContext.Provider value={{ user, updateUser, logout, fetchUser }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)