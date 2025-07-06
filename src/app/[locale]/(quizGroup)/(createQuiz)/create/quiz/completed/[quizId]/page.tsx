import React from 'react'
import styles from './completed.module.scss'
import ShareContainer from '@/components/widgets/share-container'
import {Link} from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server' // Importar
import { Metadata } from 'next'

// Atualizar IProps para incluir locale
interface IProps {
    params:Promise<{
        quizId: string,
        locale: string
    }>
}

// Adicionar generateMetadata para o título da página
export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const {locale} = await params
    const t = await getTranslations({ locale, namespace: 'quizCompletedPage' });
    return {
        title: t('metadataTitle')
    }
}

export default async function CompletedPage({params} : IProps) {
    // Receber locale e buscar traduções
    const {quizId, locale} = await params;
    const t = await getTranslations({ locale, namespace: 'quizCompletedPage' });

    return (
        <main className={styles.content}>
            {/* Usar traduções */}
            <h2>{t('title')}</h2>
            <div className={styles.share}>
                <ShareContainer
                    quizId={quizId}
                />
            </div>
            <nav className={styles.navigation_created}>
                <Link locale={locale} href={`/quiz/${quizId}`}>{t('viewQuizButton')}</Link>
                <Link locale={locale} href={`/home`}>{t('homeButton')}</Link>
            </nav>
        </main>
    )
}