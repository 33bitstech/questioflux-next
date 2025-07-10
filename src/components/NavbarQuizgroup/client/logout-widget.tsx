'use client'
import { useUser } from '@/contexts/userContext'
import { TStyles } from '@/types/stylesType'
import { useRouter } from '@/i18n/navigation'
import React from 'react'

interface IProps {
    styles: TStyles,
    text:string
}

export default function LogoutWidget({styles, text}:IProps) {
    const {logout} = useUser()
    
    return (
        <button 
            className={`${styles.second_button}`} 
            onClick={()=>{
                logout()
            }}

        >{text}</button>
    )
}
