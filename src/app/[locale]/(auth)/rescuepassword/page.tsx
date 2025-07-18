import React from 'react'
import '@/assets/styles/auth.scss'
import KeysSvg from '@/components/Icons/KeysSvg'
import RescuePasswordForm from '@/components/AuthForms/Auth-client-components/rescue-password-form'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { env } from '@/env'

interface IProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const {locale} = await params
    const t = await getTranslations({ locale, namespace: 'rescuePasswordFlow.rescuePage' });

    const langs = {
        'en-US': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/create/quiz/cover`,
        'pt-BR': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/pt/create/quiz/cover`,
        'x-default': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/create/quiz/cover`
    }

    return {
        title: t('metadataTitle'),
        alternates:{
            canonical: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/create/quiz/cover`,
            languages: langs
        },
        openGraph: {
            title: t('metadataTitle'),
            url: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}`, 
        },
        twitter: {
            title: t('metadataTitle'),
        }
    }
}

export default async function RescuePassword({ params }: IProps) {
    const {locale} = await params
    const t = await getTranslations({ locale, namespace: 'rescuePasswordFlow.rescuePage' });

    return (
        <div className='container-section'>
            <section className='forgotpass-section'>
                <KeysSvg />
                <RescuePasswordForm 
                    locale={locale}
                />
                <p>{t('registerPrompt')} <Link href='/register'>{t('registerLink')}</Link></p>
            </section>
        </div>
    )
}