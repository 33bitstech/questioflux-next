import { env } from '@/env';
import styles from './leaderboard.module.scss'
import LbUser from '@/components/Leaderboard/lb-user';
import ShareButton from '@/components/widgets/share-button';
import { TLeaderboard } from '@/types/leaderboardTypes';
import { IUser } from '@/interfaces/IUser';
import { getCookieHeader } from '@/utils/getCookieHeader'
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import GoogleAd from '@/components/Google/GoogleAd';
import { cookies } from 'next/headers';
import IUserLeaderBoardScore from '@/interfaces/IUserLeaderBoardScore';
import OwnerExtraLeaderboard from '@/components/Leaderboard/owner-extra-leaderboard';
import RecommendedQuizPopup from '@/components/Leaderboard/recommended-quiz-popup';
import { getQuizRecommendationAction } from './action';
import { getPublicQuiz, withoutQuestions } from '@/utils/publicQuiz';
import { jsonLd } from '@/utils/seo';
import { getQuizKind } from '@/utils/quizKind';
import PersonalityStats from '@/components/PersonalityResult/personality-stats';

interface IProps {
    params: Promise<{
        quizId: string,
        locale: string
    }>
}


function isGuestEntry(entry: IUserLeaderBoardScore): boolean {
    if ('isGuest' in entry) {
        return entry.isGuest === true;
    }
    return entry.name.startsWith('guest_');
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const { quizId, locale } = await params
    const t = await getTranslations({ locale, namespace: 'leaderboardPage.metadata' });
    const quiz = await getPublicQuiz(quizId)

    const langs = {
        'es': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/es/quiz/${quizId}/leaderboard`,
        'en-US': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/quiz/${quizId}/leaderboard`,
        'pt-BR': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/pt/quiz/${quizId}/leaderboard`,
        'x-default': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/quiz/${quizId}/leaderboard`
    },
        names = {
            quiz_name: quiz?.title ?? ''
        }

    // personalidade não tem ranking: a aba é a distribuição dos resultados
    if (quiz && getQuizKind(quiz) === 'personality') {
        const tStats = await getTranslations({ locale, namespace: 'personalityResultPage.stats' })
        return { title: tStats('metadataTitle', names), robots: 'noindex, follow' }
    }

    return {
        title: t('title', names),
        description: t('desc', names),
        robots: 'noindex, follow',
        keywords: "quiz, ranking, leaderboard, lb, users, answers",
        alternates: {
            canonical: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/quiz/${quizId}/leaderboard`,
            languages: langs
        },
        openGraph: {
            title: t('title', names),
            description: t('desc', names),
            url: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/quiz/${quizId}/leaderboard`,
            siteName: 'QuestioFlux',
            images: quiz?.quizThumbnail ?? `${env.NEXT_PUBLIC_DOMAIN_FRONT}/trofeu.png`,
            type: 'website'
        },
        twitter: {
            title: t('title', names),
            description: t('desc', names),
            images: [quiz?.quizThumbnail ?? `${env.NEXT_PUBLIC_DOMAIN_FRONT}/trofeu.png`],
        }
    }
}

// cookieHeader: o login de quem vê. Sem ele, o ranking vem como para um visitante
// (sem a própria entrada, se ela estiver oculta, e sem respostas).
export async function getLeaderboard(quizId: string, cookieHeader = ''): Promise<TLeaderboard | undefined> {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/leaderboard/${quizId}`, {
            method: 'GET',
            headers: { cookie: cookieHeader },
            cache: 'no-store',
        });
        const res = await response.json();
        return res.scoreBoard;
    } catch (err: any) {
        console.log(err)
    }
}

export async function getUser(cookieHeader: string): Promise<IUser | undefined> {
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

export default async function Leaderboard({ params }: IProps) {
    const { quizId, locale } = await params

    // personalidade não tem ranking: a aba mostra quanto saiu cada resultado
    const publicQuiz = await getPublicQuiz(quizId)
    if (publicQuiz && getQuizKind(publicQuiz) === 'personality') {
        return (
            <>
                <PersonalityStats quiz={withoutQuestions(publicQuiz)} locale={locale} />
                <GoogleAd slot='6282931841' />
            </>
        )
    }

    const cookieStore = await cookies()
    const cookieHeader = getCookieHeader(cookieStore.getAll()),
        t = await getTranslations({ locale, namespace: 'leaderboardPage' }),

        [quizLb, fullQuiz, user, recommendedQuiz] = await Promise.all([
            getLeaderboard(quizId, cookieHeader),
            getPublicQuiz(quizId),
            getUser(cookieHeader),
            getQuizRecommendationAction(quizId)
        ])

    // o ranking só usa dados do quiz; as questões não precisam ir para o cliente
    const quiz = fullQuiz ? withoutQuestions(fullQuiz) : null

    const registeredLb = quizLb?.filter(entry => !isGuestEntry(entry)) ?? [];
    const guestLb      = quizLb?.filter(entry =>  isGuestEntry(entry)) ?? [];

    const userInRegistered = registeredLb.find(lbUser => lbUser.userId === user?.userId);
    const userPositionReg  = userInRegistered ? registeredLb.indexOf(userInRegistered) : 999;

    const userInGuests    = guestLb.find(lbUser => lbUser.userId === user?.userId);
    const userPositionGst = userInGuests ? guestLb.indexOf(userInGuests) : 999;

    const isQuizOwner = !!user && !!quiz && user.userId === quiz.userCreatorId;

    const alreadyVisibleEntries = new Set<IUserLeaderBoardScore>([
        ...registeredLb.slice(0, 10),
        ...guestLb.slice(0, 10),
    ]);

    if (userInRegistered && userPositionReg >= 10) {
        alreadyVisibleEntries.add(userInRegistered);
    }

    if (userInGuests && userPositionGst >= 10) {
        alreadyVisibleEntries.add(userInGuests);
    }

    const ownerExtraLb = quizLb
        ?.map((userLb, index) => ({
            userLb,
            index,
        }))
        .filter(({ userLb }) => !alreadyVisibleEntries.has(userLb)) ?? [];

    const leaderboardSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": t('metadata.schemaName', { quiz_name: quiz?.title ?? '' }),
        "itemListOrder": "https://schema.org/ItemListOrderDescending",
        "itemListElement": quizLb?.map((player, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Person",
                "name": player.name,
                "url": `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/user/${player.userId}`
            }
        }))
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: jsonLd(leaderboardSchema) }}
            />

            {!quizLb && (
                <p>{t('noResults')}</p>
            )}

            <GoogleAd slot='6282931841' />

            {/* ── Leaderboard de usuários registrados ── */}
            {registeredLb.length > 0 && (
                <section className={styles.lb_section}>
                    <h2 className={styles.lb_section_title}>
                        {t('sections.registered')}
                    </h2>

                    <div className={styles.leaderboard_container}>
                        {quiz && registeredLb.slice(0, 10).map((userLb, index) => (
                            <LbUser
                                key={index}
                                locale={locale}
                                index={index}
                                styles={styles}
                                userLb={userLb}
                                quiz={quiz}
                                quizLb={registeredLb}
                                canSeeAnswers={isQuizOwner || userLb.userId === user?.userId}
                            />
                        ))}

                        {quiz && userInRegistered && userPositionReg >= 10 && (
                            <LbUser
                                locale={locale}
                                index={userPositionReg}
                                styles={styles}
                                userLb={userInRegistered}
                                quiz={quiz}
                                quizLb={registeredLb}
                                canSeeAnswers={true}
                            />
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
                            <LbUser
                                key={index}
                                locale={locale}
                                index={index}
                                styles={styles}
                                userLb={userLb}
                                quiz={quiz}
                                quizLb={guestLb}
                                canSeeAnswers={isQuizOwner}
                            />
                        ))}

                        {quiz && userInGuests && userPositionGst >= 10 && (
                            <LbUser
                                locale={locale}
                                index={userPositionGst}
                                styles={styles}
                                userLb={userInGuests}
                                quiz={quiz}
                                quizLb={guestLb}
                                canSeeAnswers={isQuizOwner || userInGuests.userId === user?.userId}
                            />
                        )}
                    </div>
                </section>
            )}

            {isQuizOwner && quiz && ownerExtraLb.length > 0 && (
                <OwnerExtraLeaderboard
                    styles={styles}
                    items={ownerExtraLb}
                    quiz={quiz}
                    locale={locale}
                    title={t('sections.others')}
                    showMoreLabel={t('showMoreOthers')}
                />
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

            <ShareButton quizId={quizId} styles={styles} />
        </>
    )
}