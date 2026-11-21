'use client'
import React from 'react'
// @ts-ignore: SCSS side-effect import declaration
import '@/assets/styles/auth.scss'
import NavButtonLogReg from './Auth-client-components/nav-button-log-reg'
import ClosePopupAuth from './Auth-client-components/close-popup-auth'
import LoginFormComponent from './Auth-client-components/login-form-component'
import { useTranslations } from 'next-intl'
import { IGoogleReturn } from './Auth-client-components/google-auth-button'

interface IPropsLogin{
    handleRegisterAndFinishQuiz: (name?:string) => void,
    toRegister: () => void,
    show_pop_up: React.Dispatch<React.SetStateAction<boolean>>
    locale:string
    googleReturn?: IGoogleReturn
}

export default function LoginComponent({handleRegisterAndFinishQuiz, toRegister, show_pop_up, locale, googleReturn}: IPropsLogin) {
    const t = useTranslations('loginPage')
    return (
        <div className={`container-section pop_up_register`}>
            <section className='login-section'>
                <ClosePopupAuth show_pop_up={show_pop_up}/>
                <LoginFormComponent locale={locale} handleRegisterAndFinishQuiz={handleRegisterAndFinishQuiz} googleReturn={googleReturn}/>
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
