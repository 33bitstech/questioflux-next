import React from 'react'
import '@/assets/styles/auth.scss'
import NavButtonLogReg from './Auth-client-components/nav-button-log-reg'
import ClosePopupAuth from './Auth-client-components/close-popup-auth'
import LoginFormComponent from './Auth-client-components/login-fom-component'

interface IPropsLogin{
    handleRegisterAndFinishQuiz: () => void,
    toRegister: () => void,
    show_pop_up: React.Dispatch<React.SetStateAction<boolean>>
}

export default function LoginComponent({handleRegisterAndFinishQuiz, toRegister, show_pop_up}: IPropsLogin) {
    return (
        <div className={`container-section pop_up_register`}>
            <section className='login-section'>
                <ClosePopupAuth show_pop_up={show_pop_up}/>
                <LoginFormComponent handleRegisterAndFinishQuiz={handleRegisterAndFinishQuiz}/>
                <p>Haven&apos;t Account? 
                    <NavButtonLogReg 
                        isLogin={true} 
                        toRegister={toRegister}
                    />
                </p>
            </section>
        </div>
    )
}
