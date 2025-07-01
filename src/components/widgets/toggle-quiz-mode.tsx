'use client'
import { verifyUserPremium } from '@/app/(quizGroup)/profile/config/actions'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { useUser } from '@/contexts/userContext'
import { TStyles } from '@/types/stylesType'
import React, { useState } from 'react'
import PopupWarningGamepass from './popup-warning-gamepass'

interface IProps{
    styles : TStyles,
    textMode: boolean
    setTextMode: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ToggleQuizMode({styles, setTextMode, textMode}: IProps) {
    const [showPopup, setShowPopup] = useState<boolean>(false),
        {token} = useUser(),
        {setError} = useGlobalMessage()

    const handleSetImageMode = () =>{
        verifyUserPremium(`${token}`).then(res=>{
            if(res.err) setError(res.err)
            const {premium, specialCount} = res.premium

            if(!premium && !specialCount) {
                setTextMode(true)
                setShowPopup(true)
            }else{
                setTextMode(false)
            }
        })
    }

    return (
        <div className={styles.quiz_mode}>
            <button className={`${textMode ? styles.actived : ''}`}
                onClick={(e)=>{
                    e.preventDefault()
                    setTextMode(true)
                }}
            >Text only</button>

            <button className={`${!textMode ? styles.actived : ''}`}
                onClick={(e)=>{
                    e.preventDefault()
                    handleSetImageMode()
                }}
            >Text and image</button>

            {showPopup && <>
                <PopupWarningGamepass
                    closePopup={()=>setShowPopup(false)}
                />
                <div className={styles.warning_overlay} onClick={()=>setShowPopup(false)}/>
            </>}
        </div>
    )
}
