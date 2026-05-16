import React from 'react'
import styles from '../../../../../(quizPage)/quiz/[quizId]/leaderboard/leaderboard.module.scss'
import { cookies } from 'next/headers'
import { getLeaderboard, getQuiz, getUser } from '@/app/[locale]/(quizGroup)/(quizPage)/quiz/[quizId]/leaderboard/page'
import LbUser from '@/components/Leaderboard/lb-user'
import GoogleAd from '@/components/Google/GoogleAd'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getCookieHeader } from '@/utils/getCookieHeader'

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

        [quizLb, quiz, user] = await Promise.all([
            getLeaderboard(quizId),
            getQuiz(quizId),
            getUser(cookieHeader)
        ])

    const isQuizOwner = !!user && !!quiz && user.userId === quiz.userCreatorId

    const userInLeaderboard = quizLb?.find(lbUser => lbUser.userId === user?.userId),
        userPosition = (quizLb && userInLeaderboard) ? quizLb.indexOf(userInLeaderboard) : 999

    return (
        <>
            <div className={styles.leaderboard_container}>
                {quiz && quizLb && quizLb.slice(0, 10).map((userLb, index) => (
                    <div className={styles.user_results} key={index}>
                        <LbUser
                            index={index}
                            styles={styles}
                            userLb={userLb}
                            quiz={quiz}
                            quizLb={quizLb}
                            locale={locale}
                            canSeeAnswers={isQuizOwner || userLb.userId === user?.userId}
                            
                        />
                    </div>
                ))}
                {quiz && quizLb && userInLeaderboard && userPosition >= 10 && (
                    <div className={styles.user_results}>
                        <LbUser
                            index={userPosition}
                            styles={styles}
                            userLb={userInLeaderboard}
                            quiz={quiz}
                            quizLb={quizLb}
                            locale={locale}
                            canSeeAnswers={true}
                            
                        />
                    </div>
                )}
            </div>

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