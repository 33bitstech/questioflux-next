import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import React, { ReactNode } from 'react'
interface IProps{
    params:Promise<{
        locale: string
    }>
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const {locale} = await params
    const t = await getTranslations({ locale, namespace: 'editQuizFlow' });
    return {
        title: t('metadataTitle')
    }
}

export default function LayoutUserQuizzes({children}: {children :ReactNode}) {
    return (    
        <>
            {children}
        </>
    )
}