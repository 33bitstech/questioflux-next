'use client'
import { useUser } from '@/contexts/userContext'
import { useRouter } from 'next/navigation'
import React from 'react'

interface IProps {
    styles: Record<string, string>
}

export default function LogoutWidget({styles}:IProps) {
    const {logout} = useUser(),
        route = useRouter()
    return (
        <button 
            className={`${styles.second_button}`} 
            onClick={()=>{
                logout()
                route.push('/')
            }}

        >Leave</button>
    )
}
