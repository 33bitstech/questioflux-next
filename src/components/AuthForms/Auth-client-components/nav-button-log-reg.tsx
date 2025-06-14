'use client'
import React from 'react'

interface IProps{
    isLogin: boolean,
    toRegister: () => void
}

export default function NavButtonLogReg({isLogin, toRegister, ...props}: IProps) {
    return (
        <button type='button' onClick={toRegister} {...props}>
            {isLogin ? 'Register' : 'Login'}
        </button>
    )
}
