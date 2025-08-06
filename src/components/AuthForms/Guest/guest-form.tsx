'use client'

import '@/assets/styles/auth.scss';
import { useTranslations } from 'next-intl';
import ClosePopupAuth from '../Auth-client-components/close-popup-auth';
import InputComponent from '../Auth-client-components/input-component';
import { FormEvent, useState } from 'react';
import ProfileSvg from '@/components/Icons/ProfileSvg';


interface IPropsGuest {
    handleRegisterAndFinishQuiz: (name:string) => void;
    toRegister: () => void;
    show_pop_up: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function GuestForm({toRegister, handleRegisterAndFinishQuiz, show_pop_up}: IPropsGuest) {

    const t = useTranslations('guestComponent')
    
    const [name, setName] = useState<string>('')

    const handleSubmit = (e:FormEvent)=>{
        e.preventDefault()
        if (!name) return
        handleRegisterAndFinishQuiz(name)
    }

    return (
        <div className={`container-section pop_up_register`}>
            <section className='guest-section'>
                <ClosePopupAuth 
                    show_pop_up={show_pop_up}
                />
                <div className='title-register'>
                    <h2>{t('title')}</h2>
                </div>

                <form className='login-form' onSubmit={handleSubmit}>

                    <div className="guest-first-part-section">
                        <InputComponent
                            type="name"
                            placeholder={t('placeholder')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            error={undefined}
                            icon={<ProfileSvg />}
                            autoFocus
                            autoComplete='name'
                        />
                    
                        <button
                            type='submit'
                            className='guest-footer-button'
                        >
                            {t('button')}
                        </button>


                        <p className='guest-footer-description'>
                            {t('description')}
                            <span
                                onClick={toRegister}
                            >{t('link')}</span>
                        </p>

                    </div>
                    
                </form>
                
            </section>
        </div>
    );
}