'use client'
import { useUser } from '@/contexts/userContext'
import { TStyles } from '@/types/stylesType'
import { useRouter } from 'next/navigation'
import React from 'react'

interface IProps {
    styles: TStyles
}

export default function LogoutWidget({styles}:IProps) {
    const {logout} = useUser()
    
    return (
        <button 
            className={`${styles.second_button}`} 
            onClick={()=>{
                logout()
            }}

        >Leave</button>
    )
}
