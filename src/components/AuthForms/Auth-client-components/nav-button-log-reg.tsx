'use client'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import React from 'react'

interface IProps{
    isLogin: boolean,
    toRegister?: () => void
}

export default function NavButtonLogReg({isLogin, toRegister, ...props}: IProps) {
    const route = useRouter()
    const t = useTranslations('loginPage.navButtons');

    return (
        <button 
            {...props}
            type='button' 
            onClick={()=>{
                if (toRegister) return toRegister()
                isLogin ? route.push('/register') : route.push('/login')
            }} 
        >
            {isLogin ? t('register') : t('login')}
        </button>
    )
}