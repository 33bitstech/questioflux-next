import React from 'react'
import '@/assets/styles/auth.scss'
import ClosePopupAuth from './Auth-client-components/close-popup-auth'
import RegisterFormComponent from './Auth-client-components/register-form-component'

interface IPropsRegister{
    handleRegisterAndFinishQuiz?: () => void,
    toLogin: () => void,
    show_pop_up?: React.Dispatch<React.SetStateAction<boolean>>,
    absolute: boolean
}

export default function RegisterComponent({handleRegisterAndFinishQuiz, toLogin, show_pop_up, absolute}: IPropsRegister) {
    return (
        <div className={`container-section ${absolute ? 'pop_up_register' : ''}`}>
            <section className='register-section'>
                {absolute && show_pop_up && <ClosePopupAuth show_pop_up={show_pop_up}/>}
                <div className='title-register'>
                    <h2>Create your account</h2>
                    <p>Start by creating your own quiz now</p>
                </div>

                <RegisterFormComponent 
                    handleRegisterAndFinishQuiz={handleRegisterAndFinishQuiz}
                    toLogin={toLogin}
                    absolute={absolute}
                />
            </section>
        </div>
    )
}
