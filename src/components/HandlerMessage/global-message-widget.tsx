'use client'
import styles from './global-message-widget.module.scss'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import React, { useEffect, useState } from 'react'
import CorrectSignal from '../Icons/CorrectSignal'
import Error from '../Icons/Error'

export default function GlobalMessageWidget() {
    const {globalMessage, resetGlobalMessage} = useGlobalMessage(),
    {type, message} = globalMessage,

    handleClose = () => {
        if (resetGlobalMessage) {
            resetGlobalMessage()
        }
    }

    useEffect(()=>{
        if (type === 'nothing') return

        const timer = setTimeout(() => {
            handleClose()
        }, 5000);

        return ()=>clearTimeout(timer)
    },[message, type])



    if(globalMessage.type === 'nothing') return null
    return (
        <div 
            className={`${styles.message_container} ${type === 'error' ? styles.error : type === 'sucess' ? styles.sucess : ''}`} 
            onClick={handleClose}
        >
            {type === 'error' && <Error/>}
            {type === 'sucess' && <CorrectSignal/>}
            <p>{message}</p>
        </div>
    )
}
