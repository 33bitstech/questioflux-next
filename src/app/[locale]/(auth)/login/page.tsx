import LoginFormComponent from '@/components/AuthForms/Auth-client-components/login-form-component'
import NavButtonLogReg from '@/components/AuthForms/Auth-client-components/nav-button-log-reg'
import React from 'react'
// @ts-ignore: SCSS side-effect import declaration
import '@/assets/styles/auth.scss'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { env } from '@/env'
import { getOpenGraphLocale } from '@/utils/locale'

interface IProps {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ code?: string; msgEN?: string; msgPT?: string }>;
}

export async function generateMetadata({ params}: IProps): Promise<Metadata> {
    const {locale} = await params
    const t = await getTranslations({ locale, namespace: 'loginPage' });

    const langs = {
        'es': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/es/login`,
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
            locale: getOpenGraphLocale(locale),
            type: 'website',
            siteName: 'QuestioFlux',
        },
        twitter: {
            title: t('metadataTitle'),
            description: t('metadataDesc'),
            card: 'summary_large_image',
            images: [`${env.NEXT_PUBLIC_DOMAIN_FRONT}/quiz_padrao_preto.png`]
        }
    }
}

export default async function Login({ params, searchParams}: IProps) {
    const {locale} = await params
    const t = await getTranslations({ locale, namespace: 'loginPage' });
    const { code, msgEN, msgPT } = await searchParams
    return (
        <div className={`container-section`}>
            <section className='login-section'>
                <LoginFormComponent
                    locale={locale}
                    oauthError={code ? { code, msgEN, msgPT } : undefined}
                />
                <p>{t('registerPrompt')} <NavButtonLogReg isLogin={true}/></p>
            </section>
        </div>
    )
}