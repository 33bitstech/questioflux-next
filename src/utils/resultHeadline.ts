// O que o cartão do resultado mostra em cada formato. Fica fora dos componentes de cliente
// para servir também ao servidor (a prévia do link compartilhado: título, descrição e imagem).
import IQuizes from '@/interfaces/IQuizes'
import IParticipationView, { IParticipationPlayer } from '@/interfaces/IParticipation'

export interface IResultHeadline {
    title: string
    description?: string
    image?: string
}

// O que a API devolve na página do resultado de cada formato (além do resumo). A parte com
// respostas, convite e comparações detalhadas só vem para quem jogou.

export interface IOptionView {
    optionId: string
    text?: string
    image?: string
    // opção apagada do quiz depois da partida
    removed?: boolean
}

export interface ITournamentView {
    champion?: IOptionView
    duels?: Array<{ round: number, a: IOptionView, b: IOptionView, winnerId: string }>
}

export interface IStoryView {
    // image: ilustração da cena final (QuestioPlus)
    ending?: { sceneId: string, title: string, text?: string, image?: string }
    steps?: number
    endingsTotal?: number
}

export interface IScoredView {
    points?: number
    range?: { rangeId: string, title: string, description?: string, min: number, max: number }
}

export interface ICompatibilityView {
    comparison?: {
        percent: number
        total?: number
        matchedCount?: number
        inviter?: IParticipationPlayer | null
        // só para quem jogou
        matched?: string[]
        theirAnswers?: Record<string, string>
    }
    inviteCode?: string
    answers?: Record<string, string>
    invited?: Array<{ participationId: string, player: IParticipationPlayer, percent: number, completedAt: string, answers: Record<string, string> }>
}

export type TTranslate = (key: string, values?: Record<string, string | number>) => string

// Personalidade: o perfil (ou os empatados); formatos com nota: os acertos.
// t: participationResultPage
export function resultHeadline(quiz: IQuizes, participation: IParticipationView, t: TTranslate): IResultHeadline | undefined {
    if (participation.results?.length) {
        const details = participation.results.map(item => quiz.personalityResults?.find(result => result.resultId === item.resultId) ?? item)
        const single = details.length === 1 ? details[0] as { title: string, description?: string, image?: string } : undefined
        return {
            title: details.map(item => item.title).join(' + '),
            description: single?.description,
            image: single?.image,
        }
    }
    if (typeof participation.score === 'string') return { title: t('score', { score: participation.score }) }
    return undefined
}

// Torneio, história, pontuação e compatibilidade. t: experiencePlay
export function experienceHeadline(participation: IParticipationView, t: TTranslate, nameOf: (player?: IParticipationPlayer | null) => string): IResultHeadline | undefined {
    switch (participation.kind) {
        case 'tournament': {
            const { champion } = participation as unknown as ITournamentView
            if (!champion) return undefined
            return { title: champion.removed ? t('tournament.removed') : champion.text ?? '', image: champion.image, description: t('tournament.championNote') }
        }
        case 'story': {
            const { ending } = participation as unknown as IStoryView
            return ending ? { title: ending.title, description: ending.text, image: ending.image } : undefined
        }
        case 'scored': {
            const { points, range } = participation as unknown as IScoredView
            if (typeof points !== 'number') return undefined
            return {
                title: range?.title ?? t('scored.pointsTotal', { points }),
                description: [t('scored.pointsTotal', { points }), range?.description].filter(Boolean).join('\n\n'),
            }
        }
        case 'compatibility': {
            const { comparison } = participation as unknown as ICompatibilityView
            if (!comparison) return { title: t('compatibility.saved'), description: t('compatibility.savedText') }
            return {
                title: t('compatibility.percent', { percent: comparison.percent }),
                description: comparison.inviter
                    ? t('compatibility.withWho', { name: nameOf(participation.player), other: nameOf(comparison.inviter) })
                    : t('compatibility.withSomeone', { name: nameOf(participation.player) }),
            }
        }
    }
    return undefined
}
