import React from 'react'
import '@/assets/styles/auth.scss'
import { Metadata } from 'next'
import RegisterFormComponent from '@/components/AuthForms/Auth-client-components/register-form-component'


export async function generateMetadata() : Promise<Metadata> {
    return {
        title: 'Register'
    }
}

export default function Register() {
    return (
        <div className={`container-section`}>
            <section className='register-section'>

                <div className='title-register'>
                    <h1>Welcome to <strong>QuizVortex</strong></h1>
                </div>

                <RegisterFormComponent 
                    absolute={false}
                />
            </section>
        </div>
    )
}
