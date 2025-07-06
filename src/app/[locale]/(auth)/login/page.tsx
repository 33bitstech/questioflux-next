import LoginFormComponent from '@/components/AuthForms/Auth-client-components/login-form-component'
import NavButtonLogReg from '@/components/AuthForms/Auth-client-components/nav-button-log-reg'
import React from 'react'
import '@/assets/styles/auth.scss'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

interface IProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params}: IProps): Promise<Metadata> {
    const {locale} = await params
    const t = await getTranslations({ locale, namespace: 'loginPage' });
    return {
        title: t('metadataTitle')
    }
}

export default async function Login({ params}: IProps) {
    const {locale} = await params
    const t = await getTranslations({ locale, namespace: 'loginPage' });

    return (
        <div className={`container-section`}>
            <section className='login-section'>
                <LoginFormComponent
                    locale={locale}
                />
                <p>{t('registerPrompt')} <NavButtonLogReg isLogin={true}/></p>
            </section>
        </div>
    )
}