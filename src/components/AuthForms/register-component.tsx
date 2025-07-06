import React from 'react';
import '@/assets/styles/auth.scss';
import ClosePopupAuth from './Auth-client-components/close-popup-auth';
import RegisterFormComponent from './Auth-client-components/register-form-component';
import { getTranslations } from 'next-intl/server'; // 1. Importar a função

interface IPropsRegister {
    handleRegisterAndFinishQuiz?: () => void;
    toLogin: () => void;
    show_pop_up?: React.Dispatch<React.SetStateAction<boolean>>;
    absolute: boolean;
    locale: string; // A prop já estava aqui, ótimo!
}

// 2. Transformar em 'async' e receber 'locale'
export default async function RegisterComponent({
    handleRegisterAndFinishQuiz, 
    toLogin, 
    show_pop_up, 
    absolute, 
    locale 
}: IPropsRegister) {
    // 3. Buscar as traduções para o namespace, passando o locale
    const t = await getTranslations({ locale, namespace: 'registerComponent' });

    return (
        <div className={`container-section ${absolute ? 'pop_up_register' : ''}`}>
            <section className='register-section'>
                {absolute && show_pop_up && <ClosePopupAuth show_pop_up={show_pop_up}/>}
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
            </section>
        </div>
    );
}