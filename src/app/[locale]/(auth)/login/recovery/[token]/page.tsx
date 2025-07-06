import React from 'react'

import '@/assets/styles/auth.scss'
import KeysSvg from '@/components/Icons/KeysSvg'
import ChangePassworForm from '@/components/AuthForms/Auth-client-components/change-password-form'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'


interface IProps {
    params: Promise<{
        token: string,
        locale: string
    }>
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const {locale} = await params
    const t = await getTranslations({ locale, namespace: 'rescuePasswordFlow.changePasswordPage' });
    return {
        title: t('metadataTitle')
    }
}

export default async function RecoveryPage({params}: IProps) {
    const {token, locale} = await params
    return (
        <div className='container-section'>
            <section className='forgotpass-section'>
                <KeysSvg />
                <ChangePassworForm
                    locale={locale}
                    token={token}
                />
            </section>
        </div>
    )
}
