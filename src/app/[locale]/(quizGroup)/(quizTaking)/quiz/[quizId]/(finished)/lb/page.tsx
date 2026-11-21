import React from 'react'
import styles from '../../../../../(quizPage)/quiz/[quizId]/leaderboard/leaderboard.module.scss'
import { cookies } from 'next/headers'
import { getPublicQuiz, withoutQuestions } from '@/utils/publicQuiz'
import GoogleAd from '@/components/Google/GoogleAd'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getCookieHeader } from '@/utils/getCookieHeader'
import RecommendedQuizPopup from '@/components/Leaderboard/recommended-quiz-popup'
import { getQuizRecommendationAction } from '@/app/[locale]/(quizGroup)/(quizPage)/quiz/[quizId]/leaderboard/action'
import LeaderboardGroups from '@/components/Leaderboard/leaderboard-groups'
import { getLeaderboardData, getViewer } from '@/utils/leaderboardData'

interface IProps {
    params: Promise<{
        quizId: string,
        locale: string
    }>
}

export default async function LB({ params }: IProps) {
    const { quizId, locale } = await params
    const cookieStore = await cookies()
    const cookieHeader = getCookieHeader(cookieStore.getAll()),
        t = await getTranslations('leaderboardPage'),

        [data, fullQuiz, user, recommendedQuiz] = await Promise.all([
            getLeaderboardData(quizId, cookieHeader),
            getPublicQuiz(quizId),
            getViewer(cookieHeader),
            getQuizRecommendationAction(quizId)
        ])

    const quiz = fullQuiz ? withoutQuestions(fullQuiz) : null

    return (
        <>
            {quiz && data && (
                <LeaderboardGroups styles={styles} data={data} quiz={quiz} locale={locale} viewerId={user?.userId} wide />
            )}

            {recommendedQuiz && (
                <RecommendedQuizPopup
                    quiz={recommendedQuiz}
                    locale={locale}
                    recommendationLabel={t('recommendationPopup.title')}
                    minimizeLabel={t('recommendationPopup.minimize')}
                    maximizeLabel={t('recommendationPopup.maximize')}
                />
            )}

            <Link
                className={styles.share_quiz}
                href={`/quiz/${quizId}`}
            >
                {t('home')}
            </Link>

            <GoogleAd slot='5791876907' />
        </>
    )
}
