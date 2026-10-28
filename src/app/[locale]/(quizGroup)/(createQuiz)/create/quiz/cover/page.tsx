import React from 'react'
import styles from './cover.module.scss'
import NavCreatinQuiz from '@/components/CreatingQuiz/nav-creating-quiz'
import FormCreateQuiz from '@/components/CreatingQuiz/form-create-quiz'
import { getTranslations } from 'next-intl/server'
import { env } from '@/env'
import { Metadata } from 'next'
import { getOpenGraphLocale } from '@/utils/locale'
import { quizKindFromParam } from '@/utils/quizKind'

interface IProps {
    params: Promise<{ locale: string }>;
    // vem da página de cada tipo: /create/quiz/cover?type=exam
    searchParams: Promise<{ type?: string | string[] }>;
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const {locale} = await params
    const t = await getTranslations({ locale, namespace: 'createQuizFlow' });

    const langs = {
        'es': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/es/create/quiz/cover`,
        'en-US': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/create/quiz/cover`,
        'pt-BR': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/pt/create/quiz/cover`,
        'zh-CN': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/zh/create/quiz/cover`,
        'x-default': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/create/quiz/cover`
    }

    return {
        title: t('layout.metadataTitle'),
        description: t('selectTypePage.desc'),
        robots: 'noindex, follow',
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
            locale: getOpenGraphLocale(locale),
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

export default async function CreatingQuiz({ params, searchParams }: IProps) {
    const {locale} = await params
    const { type } = await searchParams
    const initialKind = quizKindFromParam(Array.isArray(type) ? type[0] : type)
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
            <FormCreateQuiz styles={styles} initialKind={initialKind} />
        </main>
    )
}