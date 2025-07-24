import React from 'react'
import '@/assets/styles/auth.scss'
import { Metadata } from 'next'
import RegisterFormComponent from '@/components/AuthForms/Auth-client-components/register-form-component'
import { getTranslations } from 'next-intl/server';
import GoogleAd from '@/components/Google/GoogleAd';
import { env } from '@/env';

interface IProps{
    params: Promise<{
        locale:string
    }>
}

export async function generateMetadata({params}:IProps): Promise<Metadata> {
    const {locale} = await params
    const t = await getTranslations({ locale, namespace: 'registerPage' });

    const langs = {
        'en-US': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/register`,
        'pt-BR': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/pt/register`,
        'x-default': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/register`
    }

    return {
        title: t('metadataTitle'),
        description: t('metadataDesc'),
        robots: 'index, follow',
        keywords: "quiz, register",
        alternates:{
            canonical: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/register`,
            languages: langs
        },
        openGraph: {
            title: t('metadataTitle'),
            description: t('metadataDesc'),
            url: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/register`, 
            images: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/quiz_padrao_preto.png`,
            locale: locale == 'pt' ? 'pt_BR' : 'en_US',
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

export default async function Register({params}:IProps) {
    const {locale} = await params
    const t = await getTranslations({ locale, namespace: 'registerPage' });

    return (
        <>
            <div className={`container-section`}>
                <section className='register-section'>
                    <div className='title-register'>
                        <h1>
                            {t.rich('title', {
                                bold: (chunks) => <strong>{chunks}</strong>
                            })}
                        </h1>
                    </div>

                    <RegisterFormComponent 
                        absolute={false}
                    />
                </section>
            </div>
            <GoogleAd/>
        </>
    )
}