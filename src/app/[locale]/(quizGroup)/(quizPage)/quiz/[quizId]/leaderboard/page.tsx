import { env } from '@/env';
import styles from './leaderboard.module.scss'
import ShareButton from '@/components/widgets/share-button';
import { getCookieHeader } from '@/utils/getCookieHeader'
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import GoogleAd from '@/components/Google/GoogleAd';
import { cookies } from 'next/headers';
import RecommendedQuizPopup from '@/components/Leaderboard/recommended-quiz-popup';
import { getQuizRecommendationAction } from './action';
import { getPublicQuiz, withoutQuestions } from '@/utils/publicQuiz';
import { jsonLd } from '@/utils/seo';
import { getQuizKind } from '@/utils/quizKind';
import PersonalityStats from '@/components/PersonalityResult/personality-stats';
import LeaderboardGroups from '@/components/Leaderboard/leaderboard-groups';
import { getLeaderboardData, getViewer, isGuestEntry } from '@/utils/leaderboardData';

interface IProps {
    params: Promise<{
        quizId: string,
        locale: string
    }>
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const { quizId, locale } = await params
    const t = await getTranslations({ locale, namespace: 'leaderboardPage.metadata' });
    const quiz = await getPublicQuiz(quizId)

    const langs = {
        'es': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/es/quiz/${quizId}/leaderboard`,
        'en-US': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/quiz/${quizId}/leaderboard`,
        'pt-BR': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/pt/quiz/${quizId}/leaderboard`,
        'zh-CN': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/zh/quiz/${quizId}/leaderboard`,
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

        [data, user, recommendedQuiz] = await Promise.all([
            getLeaderboardData(quizId, cookieHeader),
            getViewer(cookieHeader),
            getQuizRecommendationAction(quizId)
        ])

    // o ranking só usa dados do quiz; as questões não precisam ir para o cliente
    const quiz = publicQuiz ? withoutQuestions(publicQuiz) : null
    const scoreBoard = data?.scoreBoard ?? []

    // só contas: visitante não tem perfil para apontar
    const leaderboardSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": t('metadata.schemaName', { quiz_name: quiz?.title ?? '' }),
        "itemListOrder": "https://schema.org/ItemListOrderDescending",
        "itemListElement": scoreBoard.filter(player => !isGuestEntry(player)).map((player, index) => ({
            "@type": "ListItem",
            "position": player.position ?? index + 1,
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

            {scoreBoard.length === 0 && (
                <p>{t('noResults')}</p>
            )}

            <GoogleAd slot='6282931841' />

            {quiz && data && (
                <LeaderboardGroups styles={styles} data={data} quiz={quiz} locale={locale} viewerId={user?.userId} />
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