'use client'

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react"
import { IUser } from "@/interfaces/IUser"
import React from 'react'
import { useGlobalMessage } from "./globalMessageContext"
import useCustomCookies from "@/hooks/useCustomCookies"
import { useRouter } from "next/navigation"

interface IUserContext {
    user: IUser | null,
    token: string | undefined
    updateUser: (userObj: IUser | null) => void,
    logout: ()=>void,
    setUserAccess: (token: string) =>void
}

const UserContext = createContext({} as IUserContext)

export function UserProvider({children} : {children : ReactNode}){
    const [user, setUser] = useState<IUser | null>(null),
    {setError} = useGlobalMessage(),
    {cookie: token, removeCookie, setToken} = useCustomCookies('token'),
    router = useRouter()

    const updateUser = useCallback((userObj: IUser | null)=>{
        setUser(userObj)
    }, []),
    logout = useCallback(()=>{
        router.push('/')

        removeCookie()
        router.refresh()
        setUser(null)
    },[]),
    setUserAccess = useCallback((token:string) =>{
        setToken(token)
    }, [])

    async function getUser(token: string) {
        try {
            const resJson = await fetch('/api/user',{
                method: 'GET',
                headers: {
                    'Authorization': token
                }, 
            })
            const res = await resJson.json()

            if(!resJson.ok) throw { response: { data: res } }

            return res
        } catch (err:any) {
            const {type} = err.response.data
            if (type == 'global'  ) return setError(err.response.data.message)
                
            throw err.response.data
        } 
    }

    useEffect(()=>{
        const checkToken = async () =>{
            if(token){
                try {
                    const {user} = await getUser(token)
                    
                    setUser(user)
                } catch (err) {
                    console.error(err)
                    logout()
                }
            }else{
                setUser(null)
            }
        }
        checkToken()
    }, [token])

    return (
        <UserContext.Provider value={{
            user, token, updateUser, logout, setUserAccess
        }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)