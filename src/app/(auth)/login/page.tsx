import LoginFormComponent from '@/components/AuthForms/Auth-client-components/login-form-component'
import NavButtonLogReg from '@/components/AuthForms/Auth-client-components/nav-button-log-reg'
import React from 'react'
import '@/assets/styles/auth.scss'
import { Metadata } from 'next'


export async function generateMetadata() : Promise<Metadata> {
    return {
        title: 'Login'
    }
}

export default function Login() {
    return (
        <div className={`container-section`}>
            <section className='login-section'>
                <LoginFormComponent/>
                <p>Haven&apos;t Account? <NavButtonLogReg isLogin={true}/></p>
            </section>
        </div>
    )
}
