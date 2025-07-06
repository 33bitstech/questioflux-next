import NavbarQuizgroup from '@/components/NavbarQuizgroup/navbar'
import React, { ReactNode } from 'react'
import styles from './layout.module.scss'
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface IProps {
    children: ReactNode,
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const {locale} = await params
    const t = await getTranslations({ locale, namespace: 'createQuizFlow.layout' });
    return {
        title: t('metadataTitle')
    };
}

export default function LayoutUserQuizzes({ children }: { children: ReactNode }) {
    return (  
        <>
            {children}
        </>
    )
}