import React from 'react'
import '@/assets/styles/auth.scss'
import KeysSvg from '@/components/Icons/KeysSvg'
import RescuePasswordForm from '@/components/AuthForms/Auth-client-components/rescue-password-form'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'

interface IProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const {locale} = await params
    const t = await getTranslations({ locale, namespace: 'rescuePasswordFlow.rescuePage' });
    return {
        title: t('metadataTitle')
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