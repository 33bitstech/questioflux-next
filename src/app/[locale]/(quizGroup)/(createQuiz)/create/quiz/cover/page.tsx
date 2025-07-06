import React from 'react'
import styles from './cover.module.scss'
import NavCreatinQuiz from '@/components/CreatingQuiz/nav-creating-quiz'
import FormCreateQuiz from '@/components/CreatingQuiz/form-create-quiz'
import { getTranslations } from 'next-intl/server'

interface IProps {
    params: Promise<{ locale: string }>;
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