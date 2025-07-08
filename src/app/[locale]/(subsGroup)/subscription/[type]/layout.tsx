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
        title: t('metadataTitle', {type: type == 'vortexplususage' ? "Usage" : "VortexPlus"})
    }
}

export default function LayoutSubsgroup({children}: {children :ReactNode}) {
    return (
        <>
            {children}
        </>
    )
}
