'use client'
import React from 'react'

interface IProps{
    isLogin: boolean,
    toRegister?: () => void
}

export default function NavButtonLogReg({isLogin, toRegister, ...props}: IProps) {
    return (
        <button 
            {...props}
            type='button' 
            onClick={()=>{
                if (toRegister) toRegister()
            }} 
        >
            {isLogin ? 'Register' : 'Login'}
        </button>
    )
}
