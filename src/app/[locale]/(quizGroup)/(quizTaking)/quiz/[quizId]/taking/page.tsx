import React, { Suspense } from 'react'
import styles from './taking.module.scss'
import TakingComponent from '@/components/TakingQuiz/taking'
import { getPublicQuiz } from '@/utils/publicQuiz'
import { notFound } from 'next/navigation'
import TakingAd from '@/components/Google/TakingAds'
import ApiData from '@/utils/ApiData'
import { getQuizKind, isExperienceKind } from '@/utils/quizKind'
import ExperienceTaking, { IInvite } from '@/components/Experiences/experience-taking'

interface IProps{
    params:Promise<{quizId: string}>
    searchParams: Promise<{ invite?: string | string[] }>
}

// Compatibilidade pelo link de alguém: o nome de quem convidou. Sem resposta da API, o convite
// segue mesmo assim (o backend compara na conclusão, se ele existir).
async function getInvite(quizId: string, code: string): Promise<IInvite> {
    try {
        const response = await ApiData({
            path: `invite/${encodeURIComponent(quizId)}/${encodeURIComponent(code)}`,
            method: 'GET',
            cache: { cache: 'no-store' },
        })
        if (response.status === 404) return { code, notFound: true }
        if (!response.ok) return { code }
        const body = await response.json()
        return { code, player: body?.invite?.player }
    } catch {
        return { code }
    }
}

export default async function Taking({params, searchParams}:IProps) {
    const {quizId} = await params
    const quiz = await getPublicQuiz(quizId)

    if (!quiz) notFound()

    const kind = getQuizKind(quiz)
    // quem criou assina o QuestioPlus: o quiz não leva anúncios
    const showAds = !quiz.adFree

    // torneio, história, compatibilidade e pontuação: partida própria de cada formato
    if (isExperienceKind(kind)) {
        const { invite } = await searchParams
        const code = typeof invite === 'string' && /^[A-Za-z0-9_-]{8,32}$/.test(invite) ? invite : undefined

        return (
            <>
                <div className={styles.header_quiz}>
                    <h1>{quiz.title}</h1>
                </div>
                {showAds && <TakingAd position='top' />}
                <ExperienceTaking
                    quiz={quiz}
                    invite={kind === 'compatibility' && code ? await getInvite(quizId, code) : undefined}
                />
                {showAds && <TakingAd position='bottom' />}
            </>
        )
    }

    return (
        <>
            <Suspense>
                <TakingComponent
                    quiz={quiz}
                    styles={styles}
                    // com key: o elemento vem pronto do servidor e entra entre os filhos do
                    // componente; sem ela o React avisa de "lista sem key" em dev
                    adTop={showAds ? <TakingAd key='ad-top' position='top' /> : undefined}
                />
            </Suspense>
            {showAds && <TakingAd position='bottom' />}
        </>
    )
}
