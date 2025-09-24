'use client'
import React from 'react';
import '@/assets/styles/auth.scss';
import ClosePopupAuth from './Auth-client-components/close-popup-auth';
import RegisterFormComponent from './Auth-client-components/register-form-component';
import { useTranslations } from 'next-intl';

interface IPropsRegister {
    handleRegisterAndFinishQuiz?: (token: string) => void;
    toLogin: () => void;
    toGuest?: () => void;
    show_pop_up?: React.Dispatch<React.SetStateAction<boolean>>;
    absolute: boolean;
    locale: string;
}

// 2. Transformar em 'async' e receber 'locale'
export default function RegisterComponent({
    handleRegisterAndFinishQuiz,
    toLogin,
    show_pop_up,
    absolute,
    locale,
    toGuest
}: IPropsRegister) {
    // 3. Buscar as traduções para o namespace, passando o locale
    const t = useTranslations('registerComponent')

    return (
        <div className={`container-section ${absolute ? 'pop_up_register' : ''}`}>
            <section className='register-section'>
                {absolute && show_pop_up && <ClosePopupAuth show_pop_up={show_pop_up} />}
                <div className='title-register'>
                    {/* 4. Usar as traduções */}
                    <h2>{t('title')}</h2>
                    <p>{t('subtitle')}</p>
                </div>

                <RegisterFormComponent
                    handleRegisterAndFinishQuiz={handleRegisterAndFinishQuiz}
                    toLogin={toLogin}
                    absolute={absolute}
                />

                {absolute && toGuest && (
                    <div className='guess-container'>
                        <div className='guess-separator'>
                            <span></span>
                            <p>{t('guess.separator')}</p>
                            <span></span>
                        </div>
                        <button className='guess-button'
                            onClick={toGuest}
                        >
                            {t('guess.button')}
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}