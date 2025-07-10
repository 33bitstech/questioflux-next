import LoginFormComponent from '@/components/AuthForms/Auth-client-components/login-form-component'
import NavButtonLogReg from '@/components/AuthForms/Auth-client-components/nav-button-log-reg'
import React from 'react'
import '@/assets/styles/auth.scss'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { env } from '@/env'

interface IProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params}: IProps): Promise<Metadata> {
    const {locale} = await params
    const t = await getTranslations({ locale, namespace: 'loginPage' });

    const langs = {
        'en-US': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/login`,
        'pt-BR': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/pt/login`,
        'x-default': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/login`
    }

    return {
        title: t('metadataTitle'),
        description: t('metadataDesc'),
        robots: 'index, follow',
        keywords: "quiz, login",
        alternates:{
            canonical: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/login`,
            languages: langs
        },
        openGraph: {
            title: t('metadataTitle'),
            description: t('metadataDesc'),
            url: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/login`, 
            images: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/quiz_padrao_preto.png`,
            locale: locale == 'pt' ? 'pt_BR' : 'en_US',
            type: 'website',
            siteName: 'Quiz Vortex',
        },
        twitter: {
            title: t('metadataTitle'),
            description: t('metadataDesc'),
            card: 'summary_large_image',
            images: [`${env.NEXT_PUBLIC_DOMAIN_FRONT}/quiz_padrao_preto.png`]
        }
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