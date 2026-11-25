'use server'

import { env } from '@/env'
import { cookies } from 'next/headers'
import { updateTag } from 'next/cache'
import { getCookieHeader } from '@/utils/getCookieHeader'
import { quizTag } from '@/utils/publicQuiz'
import { IExperienceIssue, TExperienceAnswer, TExperienceContent } from '@/interfaces/IExperience'
import { IParticipationRef } from '@/utils/participationKeys'
import { isExperienceKind } from '@/utils/quizKind'
import { experienceTemplate } from '@/utils/experienceTemplates'
import { ContentLanguage } from '@/utils/contentLanguages'
import { getAppLocale } from '@/utils/locale'

// Ações dos formatos de experiência (torneio, história, compatibilidade e pontuação): salvar
// o conteúdo do editor, subir a imagem de uma opção, concluir uma partida e criar um rascunho
// a partir do modelo do formato.

export interface IActionError {
    type: string
    message: string
    messagePT: string
    messageES?: string
}

const serverError: IActionError = {
    type: 'global',
    message: 'An error occurred on the server. Please try again later.',
    messagePT: 'Ocorreu um erro no servidor. Tente novamente mais tarde.',
    messageES: 'Ocurrió un error en el servidor. Inténtalo de nuevo más tarde.',
}

const errorOf = (body: any): IActionError => ({
    type: body?.type || 'global',
    message: body?.message || serverError.message,
    messagePT: body?.messagePT || serverError.messagePT,
    messageES: body?.messageES || serverError.messageES,
})

async function callApi(path: string, method: 'GET' | 'POST' | 'PUT', body?: unknown) {
    const cookieStore = await cookies()
    const isForm = body instanceof FormData
    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_API}/${path}`, {
        method,
        headers: {
            cookie: getCookieHeader(cookieStore.getAll()),
            ...(body !== undefined && !isForm ? { 'Content-Type': 'application/json' } : {}),
        },
        body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
        cache: 'no-store',
    })
    const data = await response.json().catch(() => null)
    return { response, data }
}

export type TSaveExperienceResult =
    | { ok: true, experience: TExperienceContent, issues: IExperienceIssue[], warnings: IExperienceIssue[] }
    // publicado com problemas: nada foi salvo, e issues diz o que corrigir
    | { ok: false, error: IActionError, issues?: IExperienceIssue[], warnings?: IExperienceIssue[] }

export async function saveExperience(quizId: string, experience: TExperienceContent): Promise<TSaveExperienceResult> {
    try {
        const { response, data } = await callApi(`experience/${encodeURIComponent(quizId)}`, 'PUT', { experience })

        if (!response.ok) {
            return {
                ok: false,
                error: errorOf(data),
                ...(Array.isArray(data?.issues) ? { issues: data.issues, warnings: data.warnings ?? [] } : {}),
            }
        }

        return { ok: true, experience: data.experience, issues: data.issues ?? [], warnings: data.warnings ?? [] }
    } catch (err) {
        console.error('[saveExperience]', err)
        return { ok: false, error: serverError }
    } finally {
        updateTag(quizTag(quizId))
    }
}

// Imagem de uma opção do torneio (a opção já foi salva). formData leva o arquivo em "quizImg".
export async function uploadExperienceImage(quizId: string, optionId: string, formData: FormData): Promise<{ ok: true, image: string } | { ok: false, error: IActionError }> {
    try {
        const { response, data } = await callApi(`experience-image/${encodeURIComponent(quizId)}/${encodeURIComponent(optionId)}`, 'PUT', formData)
        if (!response.ok || typeof data?.image !== 'string') return { ok: false, error: errorOf(data) }
        return { ok: true, image: data.image }
    } catch (err) {
        console.error('[uploadExperienceImage]', err)
        return { ok: false, error: serverError }
    } finally {
        updateTag(quizTag(quizId))
    }
}

export interface IExperienceOutcome {
    kind: string
    // compatibilidade: o convite desta conclusão (o link para chamar outra pessoa)
    inviteCode?: string
    // o convite usado não existe mais: a conclusão foi salva sem comparação
    inviteNotFound?: boolean
    [key: string]: unknown
}

export type TTakeExperienceResult =
    | { ok: true, experience: IExperienceOutcome, participation?: IParticipationRef }
    | { ok: false, error: IActionError }

// Conclusão de uma partida. O servidor confere a partida inteira contra o conteúdo salvo.
// attemptKey: criada ao começar; reenviar a mesma conclusão devolve a mesma resposta.
export async function takeExperience(
    quizId: string,
    play: { experienceAnswer: TExperienceAnswer, guest?: string, attemptKey?: string, invite?: string }
): Promise<TTakeExperienceResult> {
    try {
        const { response, data } = await callApi(`answer-quiz/${encodeURIComponent(quizId)}`, 'POST', {
            experienceAnswer: play.experienceAnswer,
            ...(play.guest ? { guest: play.guest } : {}),
            ...(play.attemptKey ? { attemptKey: play.attemptKey } : {}),
            ...(play.invite ? { invite: play.invite } : {}),
        })

        if (!response.ok || !data?.experience) return { ok: false, error: errorOf(data) }

        // contadores do quiz mudaram (aba "Resultados" e número de participantes)
        updateTag(quizTag(quizId))
        return { ok: true, experience: data.experience, participation: data.participation }
    } catch (err) {
        console.error('[takeExperience]', err)
        return { ok: false, error: serverError }
    }
}

const IDIOM_BY_LOCALE = { pt: 'PT-BR', en: 'EN-US', es: 'ES-ES', zh: 'ZH-CN' } satisfies Record<string, ContentLanguage>

// "Usar este modelo": um rascunho novo e privado de quem clicou, com o conteúdo do exemplo
// (no idioma da página) pronto para editar.
export async function createFromTemplate(kind: string, locale: string): Promise<{ ok: true, quizId: string } | { ok: false, error: IActionError }> {
    if (!isExperienceKind(kind)) return { ok: false, error: serverError }

    try {
        const template = experienceTemplate(kind, locale)
        const created = await callApi('quiz', 'POST', {
            quizData: {
                title: template.title,
                description: template.description,
                category: template.category,
                tags: template.tags,
                isPrivate: true,
                draft: true,
                idiom: IDIOM_BY_LOCALE[getAppLocale(locale)],
                kind,
            },
        })

        const quizId = created.data?.quizId
        if (!created.response.ok || typeof quizId !== 'string') return { ok: false, error: errorOf(created.data) }

        const saved = await callApi(`experience/${encodeURIComponent(quizId)}`, 'PUT', { experience: template.content })
        // o rascunho existe mesmo assim: o editor abre vazio e a pessoa continua de lá
        if (!saved.response.ok) console.error('[createFromTemplate] experience', saved.response.status)

        return { ok: true, quizId }
    } catch (err) {
        console.error('[createFromTemplate]', err)
        return { ok: false, error: serverError }
    }
}
