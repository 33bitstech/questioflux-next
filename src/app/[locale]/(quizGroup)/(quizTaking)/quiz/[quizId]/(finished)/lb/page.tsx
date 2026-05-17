import React from 'react'
import styles from '../../../../../(quizPage)/quiz/[quizId]/leaderboard/leaderboard.module.scss'
import { cookies } from 'next/headers'
import { getLeaderboard, getQuiz, getUser } from '@/app/[locale]/(quizGroup)/(quizPage)/quiz/[quizId]/leaderboard/page'
import LbUser from '@/components/Leaderboard/lb-user'
import GoogleAd from '@/components/Google/GoogleAd'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getCookieHeader } from '@/utils/getCookieHeader'
import IUserLeaderBoardScore from '@/interfaces/IUserLeaderBoardScore'

interface IProps {
    params: Promise<{
        quizId: string,
        locale: string
    }>
}

function isGuestEntry(entry: IUserLeaderBoardScore): boolean {
    if ('isGuest' in entry) return entry.isGuest === true
    return entry.name.startsWith('guest_')
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

    const registeredLb = quizLb?.filter(entry => !isGuestEntry(entry)) ?? []
    const guestLb      = quizLb?.filter(entry =>  isGuestEntry(entry)) ?? []

    const userInRegistered = registeredLb.find(lb => lb.userId === user?.userId)
    const userPositionReg  = userInRegistered ? registeredLb.indexOf(userInRegistered) : 999

    const userInGuests   = guestLb.find(lb => lb.userId === user?.userId)
    const userPositionGst = userInGuests ? guestLb.indexOf(userInGuests) : 999

    return (
        <>
            {/* ── Leaderboard de usuários registrados ── */}
            {registeredLb.length > 0 && (
                <section className={styles.lb_section}>
                    <h2 className={styles.lb_section_title}>
                        {t('sections.registered')}
                    </h2>

                    <div className={styles.leaderboard_container}>
                        {quiz && registeredLb.slice(0, 10).map((userLb, index) => (
                            <div className={styles.user_results} key={index}>
                                <LbUser
                                    index={index}
                                    styles={styles}
                                    userLb={userLb}
                                    quiz={quiz}
                                    quizLb={registeredLb}
                                    locale={locale}
                                    canSeeAnswers={isQuizOwner || userLb.userId === user?.userId}
                                />
                            </div>
                        ))}
                        {quiz && userInRegistered && userPositionReg >= 10 && (
                            <div className={styles.user_results}>
                                <LbUser
                                    index={userPositionReg}
                                    styles={styles}
                                    userLb={userInRegistered}
                                    quiz={quiz}
                                    quizLb={registeredLb}
                                    locale={locale}
                                    canSeeAnswers={true}
                                />
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* ── Leaderboard de guests ── */}
            {guestLb.length > 0 && (
                <section className={styles.lb_section}>
                    <h2 className={styles.lb_section_title}>
                        {t('sections.guests')}
                    </h2>

                    <div className={`${styles.leaderboard_container} ${styles.leaderboard_container__guest}`}>
                        {quiz && guestLb.slice(0, 10).map((userLb, index) => (
                            <div className={styles.user_results} key={index}>
                                <LbUser
                                    index={index}
                                    styles={styles}
                                    userLb={userLb}
                                    quiz={quiz}
                                    quizLb={guestLb}
                                    locale={locale}
                                    canSeeAnswers={isQuizOwner}
                                />
                            </div>
                        ))}
                        {quiz && userInGuests && userPositionGst >= 10 && (
                            <div className={styles.user_results}>
                                <LbUser
                                    index={userPositionGst}
                                    styles={styles}
                                    userLb={userInGuests}
                                    quiz={quiz}
                                    quizLb={guestLb}
                                    locale={locale}
                                    canSeeAnswers={isQuizOwner || userInGuests.userId === user?.userId}
                                />
                            </div>
                        )}
                    </div>
                </section>
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