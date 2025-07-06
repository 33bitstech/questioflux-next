'use client'
import React from 'react'
import '@/assets/styles/auth.scss'
import NavButtonLogReg from './Auth-client-components/nav-button-log-reg'
import ClosePopupAuth from './Auth-client-components/close-popup-auth'
import LoginFormComponent from './Auth-client-components/login-form-component'
import { useTranslations } from 'next-intl'

interface IPropsLogin{
    handleRegisterAndFinishQuiz: (token:string) => void,
    toRegister: () => void,
    show_pop_up: React.Dispatch<React.SetStateAction<boolean>>
    locale:string
}

export default function LoginComponent({handleRegisterAndFinishQuiz, toRegister, show_pop_up, locale}: IPropsLogin) {
    const t = useTranslations('loginPage')
    return (
        <div className={`container-section pop_up_register`}>
            <section className='login-section'>
                <ClosePopupAuth show_pop_up={show_pop_up}/>
                <LoginFormComponent locale={locale} handleRegisterAndFinishQuiz={handleRegisterAndFinishQuiz}/>
                <p>{t('registerPrompt')} 
                    <NavButtonLogReg 
                        isLogin={true} 
                        toRegister={toRegister}
                    />
                </p>
            </section>
        </div>
    )
}
