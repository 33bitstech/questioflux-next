import LoginFormComponent from '@/components/AuthForms/Auth-client-components/login-fom-component'
import NavButtonLogReg from '@/components/AuthForms/Auth-client-components/nav-button-log-reg'
import React from 'react'
import '@/assets/styles/auth.scss'

export default function Login() {
    const h = async () =>{
        'use server'
    }
    return (
        <div className={`container-section`}>
            <section className='login-section'>
                <LoginFormComponent handleRegisterAndFinishQuiz={h}/>
                <p>Haven&apos;t Account? 
                    <NavButtonLogReg 
                        isLogin={true} 
                        toRegister={h}
                    />
                </p>
            </section>
        </div>
    )
}
