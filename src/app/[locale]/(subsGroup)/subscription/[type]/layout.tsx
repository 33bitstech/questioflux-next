import React, { ReactNode } from 'react'
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface IProps{
    params: Promise<{
        locale:string,
        type:string
    }>
}

export async function generateMetadata({params}:IProps) : Promise<Metadata> {
    const {locale, type} = await params
    const t = await getTranslations({locale, namespace: 'SubscriptionPage'});
    return {
        title: type === 'questioplususage' ? t('metadataTitleUsage') : t('metadataTitlePlus'),
        // página de pagamento, só para quem está logado: fora da busca
        robots: { index: false, follow: false },
    }
}

export default function LayoutSubsgroup({children}: {children :ReactNode}) {
    return (
        <>
            {children}
        </>
    )
}
