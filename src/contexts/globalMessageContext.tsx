'use client'

import { createContext, ReactNode, useCallback, useContext, useState, useMemo } from "react"

type TypeMessage = 'sucess' | 'error' | 'warning' | 'nothing'

interface IGlobalMessage {
    type: TypeMessage
    message?: string
}

interface IGlobalMessageContext {
    globalMessage: IGlobalMessage,
    resetGlobalMessage: () => void,
    setError: (message: string) => void,
    setSucess: (message: string) => void,
    setWarning: (message: string) => void
}

const GlobalMessageContext = createContext({} as IGlobalMessageContext)

export function GlobalMessageProvider({ children }: { children: ReactNode }) {
    const [globalMessage, setGlobalMessage] = useState<IGlobalMessage>({ type: 'nothing' })

    const resetGlobalMessage = useCallback(() => {
        setGlobalMessage({ type: 'nothing', message: undefined })
    }, [])

    const setError = useCallback((message: string): void => {
        setGlobalMessage({ type: 'error', message })
    }, [])

    const setSucess = useCallback((message: string): void => {
        setGlobalMessage({ type: 'sucess', message })
    }, [])

    const setWarning = useCallback((message: string): void => {
        setGlobalMessage({ type: 'warning', message })
    }, [])

    const contextValue = useMemo(() => ({
        globalMessage,
        resetGlobalMessage,
        setError,
        setSucess,
        setWarning
    }), [globalMessage, resetGlobalMessage, setError, setSucess, setWarning])

    return (
        <GlobalMessageContext.Provider value={contextValue}>
            {children}
        </GlobalMessageContext.Provider>
    )
}

export const useGlobalMessage = () => useContext(GlobalMessageContext)