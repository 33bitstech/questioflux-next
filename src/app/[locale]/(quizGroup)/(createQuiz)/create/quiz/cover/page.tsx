import React from 'react'
import styles from './cover.module.scss'
import NavCreatinQuiz from '@/components/CreatingQuiz/nav-creating-quiz'
import FormCreateQuiz from '@/components/CreatingQuiz/form-create-quiz'
import { getTranslations } from 'next-intl/server'
import { env } from '@/env'
import { Metadata } from 'next'

interface IProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const {locale} = await params
    const t = await getTranslations({ locale, namespace: 'createQuizFlow' });

    const langs = {
        'en-US': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/create/quiz/cover`,
        'pt-BR': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/pt/create/quiz/cover`,
        'x-default': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/create/quiz/cover`
    }

    return {
        title: t('layout.metadataTitle'),
        description: t('selectTypePage.desc'),
        robots: 'index, follow',
        keywords: "quiz, create, type",
        alternates:{
            canonical: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/create/quiz/cover`,
            languages: langs
        },
        openGraph: {
            title: t('layout.metadataTitle'),
            description: t('selectTypePage.desc'),
            url: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/create/quiz/cover`, 
            siteName: 'QuestioFlux',
            images: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/quiz_padrao_preto.png`,
            locale: locale == 'pt' ? 'pt_BR' : 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: t('layout.metadataTitle'),
            description: t('selectTypePage.desc'),
            images: [`${env.NEXT_PUBLIC_DOMAIN_FRONT}/quiz_padrao_preto.png`],
        }
    }
}

export default async function CreatingQuiz({ params }: IProps) {
    const {locale} = await params
    const t = await getTranslations({ locale, namespace: 'createQuizFlow.formPage' });

    return (
        <main className={styles.content}>
            <div className={styles.subtitle_creations}>
                <NavCreatinQuiz isBlock={true} locale={locale} />
                <p>
                    {t.rich('saveDraftInfo', {
                        drafts: (chunks) => <span>{chunks}</span>
                    })}
                </p>
            </div>
            <FormCreateQuiz styles={styles} />
        </main>
    )
}