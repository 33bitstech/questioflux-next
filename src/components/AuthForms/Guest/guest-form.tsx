'use client'

// @ts-ignore: SCSS side-effect import declaration
import '@/assets/styles/auth.scss';
import { useLocale, useTranslations } from 'next-intl';
import ClosePopupAuth from '../Auth-client-components/close-popup-auth';
import InputComponent from '../Auth-client-components/input-component';
import { FormEvent, useState } from 'react';
import ProfileSvg from '@/components/Icons/ProfileSvg';
import GoogleAuthButton, { IGoogleReturn } from '../Auth-client-components/google-auth-button';
import { looksLikeEmail } from '@/utils/publicName';


interface IPropsGuest {
    handleRegisterAndFinishQuiz: (name:string) => void;
    // formatos sem ranking: dá para seguir sem apelido (aparece como Convidado)
    allowAnonymous?: boolean;
    // sem toRegister (quiz embutido em outro site) não há cadastro nem login com Google:
    // os dois dependem de cookies e de redirecionamentos que o iframe não aceita
    toRegister?: () => void;
    show_pop_up: React.Dispatch<React.SetStateAction<boolean>>;
    googleReturn?: IGoogleReturn;
}

export default function GuestForm({toRegister, handleRegisterAndFinishQuiz, show_pop_up, googleReturn, allowAnonymous}: IPropsGuest) {

    const t = useTranslations('guestComponent')
    const locale = useLocale()
    
    const [name, setName] = useState<string>('')
    const [error, setError] = useState<string>()

    const handleSubmit = (e:FormEvent)=>{
        e.preventDefault()
        if (!name) return
        // o apelido aparece para outras pessoas (lista de participantes, ranking): e-mail não
        // serve (o backend também recusa)
        if (looksLikeEmail(name)) return setError(t('emailError'))
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
                            onChange={(e) => { setName(e.target.value); setError(undefined) }}
                            error={error}
                            icon={<ProfileSvg />}
                            autoFocus
                            autoComplete='name'
                        />
                    
                        <p className='guest-name-note'>{t('nameNote')}</p>

                        <button
                            type='submit'
                            className='guest-footer-button'
                        >
                            {t('button')}
                        </button>

                        {allowAnonymous && <>
                            <button
                                type='button'
                                className='guest-anonymous-button'
                                onClick={() => handleRegisterAndFinishQuiz('')}
                            >
                                {t('anonymous')}
                            </button>
                            <p className='guest-name-note'>{t('anonymousNote')}</p>
                        </>}


                        {toRegister && <>
                            <p className='guest-footer-description'>
                                {t('description')}
                                <span
                                    onClick={toRegister}
                                >{t('link')}</span>
                            </p>
                            <GoogleAuthButton locale={locale} googleReturn={googleReturn} />
                        </>}
                    </div>
                    
                </form>
                
            </section>
        </div>
    );
}