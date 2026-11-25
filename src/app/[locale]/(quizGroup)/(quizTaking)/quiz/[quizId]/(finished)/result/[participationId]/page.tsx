import { cache } from 'react'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import ApiData from '@/utils/ApiData'
import { getCookieHeader } from '@/utils/getCookieHeader'
import { getPublicQuiz, withoutQuestions } from '@/utils/publicQuiz'
import { quizCanonicalUrl, quizImageUrl } from '@/utils/seo'
import IParticipationView from '@/interfaces/IParticipation'
import ParticipationResult from '@/components/ParticipationResult/participation-result'
import GoogleAd from '@/components/Google/GoogleAd'
import AdRails from '@/components/Google/AdRails'

interface IProps {
    params: Promise<{ quizId: string, participationId: string, locale: string }>
}

// mesmo bloco de anúncio da página de resultados
const RESULTS_AD_SLOT = '8751962602'

// Com o cookie: uma conta que ocultou a atividade continua vendo o próprio resultado.
const getParticipation = cache(async (quizId: string, participationId: string): Promise<IParticipationView | null> => {
    try {
        const cookieStore = await cookies()
        const response = await ApiData({
            path: `participation/${encodeURIComponent(quizId)}/${encodeURIComponent(participationId)}`,
            method: 'GET',
            headerKey: 'Cookie',
            headerValue: getCookieHeader(cookieStore.getAll()),
            cache: { cache: 'no-store' },
        })
        if (!response.ok) return null
        const body = await response.json()
        return body?.participation ?? null
    } catch {
        return null
    }
})

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const { quizId, participationId, locale } = await params
    const [quiz, participation] = await Promise.all([getPublicQuiz(quizId), getParticipation(quizId, participationId)])
    if (!quiz || !participation) notFound()

    const t = await getTranslations({ locale, namespace: 'participationResultPage' })
    const name = participation.player.name
    const title = name ? t('metaTitle', { name, quiz: quiz.title }) : t('metaTitleAnonymous', { quiz: quiz.title })

    return {
        title,
        // um resultado de cada pessoa: compartilhável, mas fora da busca
        robots: { index: false, follow: true },
        openGraph: { title, images: [quizImageUrl(quiz)] },
    }
}

export default async function ParticipationResultPage({ params }: IProps) {
    const { quizId, participationId } = await params
    const [quiz, participation] = await Promise.all([getPublicQuiz(quizId), getParticipation(quizId, participationId)])
    if (!quiz || !participation) notFound()

    return (
        <>
            <ParticipationResult
                quiz={withoutQuestions(quiz)}
                participation={participation}
                shareUrl={`${quizCanonicalUrl(quiz)}/result/${participation.participationId}`}
                inviteBaseUrl={`${quizCanonicalUrl(quiz)}/taking`}
            />
            <GoogleAd slot={RESULTS_AD_SLOT} />
            <AdRails />
        </>
    )
}
