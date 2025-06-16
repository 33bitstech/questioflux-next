'use client'

import { createContext, ReactNode, useCallback, useContext, useState } from "react"

type TypeMessage = 'sucess' | 'error' | 'warning' | 'nothing'

interface IGlobalMessage{
    type: TypeMessage
    message?: string
}
interface IGlobalMessageContext {
    globalMessage: IGlobalMessage,
    resetGlobalMessage: () => void,
    setError: (message:string) => void,
    setSucess: (message:string) => void,
    setWarning: (message:string) => void
}

const GlobalMessageContext = createContext({} as IGlobalMessageContext)

export function GlobalMessageProvider({children} : {children : ReactNode}){
    const [globalMessage, setGlobalMessage] = useState<IGlobalMessage>({type:'nothing'})

    const resetGlobalMessage = useCallback(() => {
        setGlobalMessage({ type: 'nothing', message: '' })
    }, [])
    const setError = (message: string) : void => {
        setGlobalMessage({type:'error', message})
    }
    const setSucess = (message: string) : void => {
        setGlobalMessage({type:'sucess', message})
    }
    const setWarning = (message: string) : void => {
        setGlobalMessage({type:'warning', message})
    }

    return (
        <GlobalMessageContext.Provider value={{
            globalMessage,
            resetGlobalMessage,
            setError,
            setSucess,
            setWarning
        }}>
            {children}
        </GlobalMessageContext.Provider>
    )
}

export const useGlobalMessage = () => useContext(GlobalMessageContext)