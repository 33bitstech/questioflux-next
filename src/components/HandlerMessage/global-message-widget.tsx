'use client'
import styles from './global-message-widget.module.scss'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import React, { useEffect, useState } from 'react'
import CorrectSignal from '../Icons/CorrectSignal'
import Error from '../Icons/Error'

export default function GlobalMessageWidget() {
    const {globalMessage, resetGlobalMessage} = useGlobalMessage(),
    {type, message} = globalMessage,
    [clear, setClear] = useState<boolean>(false)

    useEffect(()=>{
        setClear(false)

        const tout = setTimeout(() => {
            setClear(true)
        }, 5000);

        return ()=>clearTimeout(tout)
    },[message])

    useEffect(()=>{
        if(clear && resetGlobalMessage) resetGlobalMessage()
    }, [clear, resetGlobalMessage])


    if(globalMessage.type === 'nothing') return <></>
    return (
        <div 
            className={`${styles.message_container} ${type === 'error' ? styles.error : type === 'sucess' ? styles.sucess : ''}`} 
            onClick={()=>setClear(true)}
        >
            {type === 'error' && <Error/>}
            {type === 'sucess' && <CorrectSignal/>}
            <p>{message}</p>
        </div>
    )
}
