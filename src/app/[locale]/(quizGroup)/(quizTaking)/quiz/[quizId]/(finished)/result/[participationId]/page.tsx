import { cache } from 'react'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import ApiData from '@/utils/ApiData'
import { getCookieHeader } from '@/utils/getCookieHeader'
import { getPublicQuiz, withoutQuestions } from '@/utils/publicQuiz'
import { quizCanonicalUrl } from '@/utils/seo'
import { RESULT_PREVIEW_SIZE, resultPreview, resultPreviewImageUrl } from '@/utils/resultPreview'
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

    const [t, preview] = await Promise.all([
        getTranslations({ locale, namespace: 'participationResultPage' }),
        resultPreview(quiz, participation, locale),
    ])
    const name = participation.player.name
    const title = name ? t('metaTitle', { name, quiz: quiz.title }) : t('metaTitleAnonymous', { quiz: quiz.title })

    // a prévia do link compartilhado mostra o próprio resultado (texto e imagem gerada), não a capa
    const description = [preview.title, preview.description].filter(Boolean).join(' · ')
    const image = { url: resultPreviewImageUrl(quizId, participationId, locale), ...RESULT_PREVIEW_SIZE, alt: description }

    return {
        title,
        description,
        // um resultado de cada pessoa: compartilhável, mas fora da busca
        robots: { index: false, follow: true },
        openGraph: { title, description, images: [image], siteName: 'QuestioFlux', type: 'website' },
        twitter: { card: 'summary_large_image', title, description, images: [image.url] },
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
            {/* quem criou assina o QuestioPlus: o quiz não leva anúncios */}
            {!quiz.adFree && <>
                <GoogleAd slot={RESULTS_AD_SLOT} />
                <AdRails />
            </>}
        </>
    )
}
