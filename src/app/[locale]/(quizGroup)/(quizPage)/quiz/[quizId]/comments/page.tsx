import React from 'react'
import styles from './comments.module.scss'
import { IUser } from '@/interfaces/IUser'
import { env } from '@/env'
import { getCookieHeader } from '@/utils/getCookieHeader'
import CommentFormComponent from '@/components/Comment/comment-form-component'
import IComment from '@/interfaces/IComment'
import CommentContainer from '@/components/Comment/comment-container'
import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { getQuiz } from '../leaderboard/page'
import { Metadata } from 'next'

interface IProps {
    params: Promise<{
        quizId: string,
        locale: string,
    }>
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const { quizId, locale } = await params
    const t = await getTranslations({ locale, namespace: 'quizInfoPage.metadata' });
    const quiz = await getQuiz(quizId)

    const langs = {
        'es': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/es/quiz/${quizId}/comments`,
        'en-US': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/quiz/${quizId}/comments`,
        'pt-BR': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/pt/quiz/${quizId}/comments`,
        'x-default': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/quiz/${quizId}/comments`
    },
        names = {
            quiz_name: quiz?.title ?? ''
        }

    if (!quiz) return { title: 'null' }
    return {
        title: t('title', names),
        description: quiz.description,
        robots: 'noindex, follow',
        keywords: "quiz, comments, users, discussion",
        alternates: {
            canonical: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/quiz/${quizId}/comments`,
            languages: langs
        },
        openGraph: {
            title: t('title', names),
            description: quiz.description,
            url: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/quiz/${quizId}/comments`,
            siteName: 'QuestioFlux',
            images: quiz?.quizThumbnail ?? `${env.NEXT_PUBLIC_DOMAIN_FRONT}/trofeu.png`,
            type: 'website'
        },
        twitter: {
            title: t('title', names),
            description: quiz.description,
            images: [quiz?.quizThumbnail ?? `${env.NEXT_PUBLIC_DOMAIN_FRONT}/trofeu.png`],
        }
    }
}

async function getUser(cookieHeader: string): Promise<IUser | undefined> {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/user`, {
            method: 'GET',
            headers: { 'cookie': cookieHeader },
        });
        const res = await response.json();
        return res.user;
    } catch (err) {
        console.log(err)
    }
}
async function getComments(quizId: string): Promise<IComment[] | undefined> {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/comments/${quizId}`, {
            method: 'GET'
        });

        const res = await response.json();
        return res.commentsMargedArray;
    } catch (err) {
        console.log(err)
    }
}
export default async function Comment({ params }: IProps) {
    const { quizId, locale } = await params;
    const t = await getTranslations({ locale, namespace: 'commentsSection' });
    const cookieStore = await cookies()
    const cookieHeader = getCookieHeader(cookieStore.getAll())

    const [user, comments] = await Promise.all([
        getUser(cookieHeader),
        getComments(quizId)
    ]);

    const isCommentsEmpty = !comments || comments.length === 0

    return (
        <div className={styles.comment_area}>
            <p>{t('title', { count: comments?.length || 0 })}</p>

            {user && <CommentFormComponent
                styles={styles}
                user={user}
                quizId={quizId}
            />}

            {isCommentsEmpty && user && (<p className={styles.no_comment}>{t('noComments')}</p>)}
            {isCommentsEmpty && !user && (<p className={styles.no_comment}>{t('noCommentsNoUser')}</p>)}

            {!isCommentsEmpty && <div className={styles.comments}>
                {comments?.map((com, index) => (
                    <div key={index}>
                        {com && <CommentContainer
                            comment={com}
                            quizId={quizId}
                            locale={locale}
                        />}
                    </div>
                ))}
            </div>}
        </div>
    )
}