// O que a prévia do link de um resultado mostra (Discord, WhatsApp, redes): o próprio
// resultado, não a capa do quiz. Serve à metadata da página e à imagem gerada.
import { getTranslations } from 'next-intl/server'
import IQuizes from '@/interfaces/IQuizes'
import IParticipationView, { IParticipationPlayer } from '@/interfaces/IParticipation'
import { getQuizKind, isExperienceKind } from '@/utils/quizKind'
import { ICompatibilityView, experienceHeadline, resultHeadline } from '@/utils/resultHeadline'
import { env } from '@/env'

export interface IResultPreview {
    // linha pequena de cima ("Resultado de Ana", "Teste de compatibilidade")
    eyebrow: string
    title: string
    description?: string
    // imagem do próprio resultado (campeão, final, perfil); sem ela, a capa do quiz
    image?: string
    // compatibilidade já comparada: o anel com a porcentagem
    percent?: number
}

const oneLine = (text?: string) => (text ?? '').replace(/\s+/g, ' ').trim()

export async function resultPreview(quiz: IQuizes, participation: IParticipationView, locale: string): Promise<IResultPreview> {
    const [t, te, tTypes] = await Promise.all([
        getTranslations({ locale, namespace: 'participationResultPage' }),
        getTranslations({ locale, namespace: 'experiencePlay' }),
        getTranslations({ locale, namespace: 'quizTypes' }),
    ])
    const nameOf = (someone?: IParticipationPlayer | null) => someone?.name || t('guest')
    const name = nameOf(participation.player)
    const kind = getQuizKind(quiz)
    const experience = isExperienceKind(kind) && participation.kind === kind

    if (experience && kind === 'compatibility') {
        const { comparison } = participation as unknown as ICompatibilityView
        // ninguém respondeu pelo convite ainda: a prévia chama quem recebe o link
        if (!comparison) {
            return { eyebrow: tTypes(`names.${kind}`), title: t('previewInvite', { name }), description: t('previewInviteText') }
        }
        return {
            eyebrow: tTypes(`names.${kind}`),
            title: comparison.inviter
                ? te('compatibility.withWho', { name, other: nameOf(comparison.inviter) })
                : te('compatibility.withSomeone', { name }),
            description: te('compatibility.percent', { percent: comparison.percent }),
            percent: comparison.percent,
        }
    }

    const headline = experience ? experienceHeadline(participation, te, nameOf) : resultHeadline(quiz, participation, t)
    return {
        eyebrow: t('resultOf', { name }),
        title: oneLine(headline?.title) || t('completed'),
        description: oneLine(headline?.description) || undefined,
        image: headline?.image,
    }
}

// endereço absoluto da imagem (a prévia exige URL completa); v muda quando o desenho mudar
export const resultPreviewImageUrl = (quizId: string, participationId: string, locale: string) =>
    `${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/og/result/${encodeURIComponent(quizId)}/${encodeURIComponent(participationId)}?locale=${locale}&v=1`

export const RESULT_PREVIEW_SIZE = { width: 1200, height: 630 }
