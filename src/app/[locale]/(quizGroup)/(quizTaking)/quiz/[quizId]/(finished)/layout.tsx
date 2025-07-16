import React, { ReactNode } from 'react'
import styles from './layout.module.scss'
import { Metadata } from 'next';
import TimerContainer from '@/components/widgets/TakingQuiz/timer-container';
import Image from 'next/image';
import NavLink from '@/components/widgets/NavLink';
import { getQuiz } from '@/app/[locale]/(quizGroup)/(quizPage)/quiz/[quizId]/leaderboard/page';
import { getTranslations } from 'next-intl/server'; // Importar

// Atualizar IProps para incluir locale
interface IProps {
    children: ReactNode,
    params: Promise<{
        quizId: string,
        locale: string
    }>
}

// Atualizar generateMetadata para ser dinâmico
export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const { locale, quizId } = await params;
    const t = await getTranslations({ locale, namespace: 'quizResultsPage.layout' });
    const quiz = await getQuiz(quizId);
    return {
        title: `${t('metadataTitle')} - ${quiz?.title || ''}`
    };
}

export default async function LayoutTaking({children, params}: IProps) {
    const {quizId, locale} = await params;
    const t = await getTranslations({ locale, namespace: 'quizResultsPage.layout' });
    const quiz = await getQuiz(quizId);

    if(!quiz) return null; // Retornar nulo se o quiz não for encontrado

    return (
        <>
            <div className={styles.header_quiz}>
                <h1>{quiz?.title}</h1>

                <div className={styles.img_quiz_container}>
                    <Image
                        src={quiz?.quizThumbnail !== 'default' 
                            ? quiz?.quizThumbnail 
                            : '/imageQuizDefault.jpg'} 
                        alt={t('altQuizImage')} 
                        width={800}
                        height={800}
                        quality={100}
                        fetchPriority='high'
                        loading='lazy'
                    />
                </div>

                <nav className={`${styles.navigate}`}>
                    <ul>
                        <li>
                            <NavLink 
                                href={`/quiz/${quizId}/results`} 
                                styles={styles}
                            >{t('navResults')}</NavLink>
                        </li>
                        <li>
                            <NavLink 
                                href={`/quiz/${quizId}/lb`} 
                                styles={styles}
                            >{t('navLeaderboard')}</NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
            {children}
        </>
    )
}