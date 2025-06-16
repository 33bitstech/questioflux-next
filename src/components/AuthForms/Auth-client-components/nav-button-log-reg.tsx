'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

interface IProps{
    isLogin: boolean,
    toRegister?: () => void
}

export default function NavButtonLogReg({isLogin, toRegister, ...props}: IProps) {
    const route = useRouter()
    return (
        <button 
            {...props}
            type='button' 
            onClick={()=>{
                if (toRegister) return toRegister()
                isLogin ? route.push('/register') : route.push('/login')
            }} 
        >
            {isLogin ? 'Register' : 'Login'}
        </button>
    )
}
