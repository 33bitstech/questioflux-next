'use server'

import { env } from "@/env"
import { getCookieHeader } from "@/utils/getCookieHeader"
import { openQuizSession, sealQuizSession } from "@/utils/quizSession"
import { cookies } from "next/headers"
import { updateTag } from "next/cache"
import { quizTag } from "@/utils/publicQuiz"
import IExamReviewQuestion from "@/interfaces/IExamReview"
import IPersonalityOutcome from "@/interfaces/IPersonalityOutcome"

const START_COOKIE = (id: string) => `quiz_start_${id}`
const ELAPSED_COOKIE = (id: string) => `quiz_elapsed_${id}`
const COOKIE_OPTIONS = { httpOnly: true, sameSite: 'strict' as const, path: '/', maxAge: 60 * 60 }

// No embed (iframe em outro site) os cookies acima não chegam ao navegador. Com useToken a
// sessão vai num token assinado, que o client devolve em pauseQuiz e em takeQuiz.
export async function startQuiz(quizId: string, useToken = false): Promise<{ ok: boolean; token?: string }> {
    if (useToken) return { ok: true, token: sealQuizSession(quizId, 'start', Date.now()) }

    const cookieStore = await cookies()
    cookieStore.set(START_COOKIE(quizId), String(Date.now()), COOKIE_OPTIONS)
    return { ok: true }
}


export async function pauseQuiz(quizId: string, token?: string): Promise<{ ok: boolean; token?: string }> {
    if (token) {
        const startedAt = openQuizSession(quizId, 'start', token)

        if (!startedAt) return { ok: false }

        return { ok: true, token: sealQuizSession(quizId, 'elapsed', Date.now() - startedAt) }
    }

    const cookieStore = await cookies()
    const startCookie = cookieStore.get(START_COOKIE(quizId))

    if (!startCookie?.value) return { ok: false }

    const elapsed = Date.now() - Number(startCookie.value)
    cookieStore.delete(START_COOKIE(quizId))
    cookieStore.set(ELAPSED_COOKIE(quizId), String(elapsed), COOKIE_OPTIONS)
    return { ok: true }
}

export async function takeQuiz(quizId: string, results: { quizAnswer: any; guest?: string }, token?: string) {
    try {
        const cookieStore = await cookies()
        const elapsed = token
            ? openQuizSession(quizId, 'elapsed', token)
            : cookieStore.get(ELAPSED_COOKIE(quizId))?.value
        if (!elapsed) {
            return { err: 'Quiz session not found. Please start the quiz again.' }
        }
        const timing = Number(elapsed)
        if (isNaN(timing) || timing <= 0) {
            return { err: 'Invalid quiz session. Please start the quiz again.' }
        }
        if (!token) cookieStore.delete(ELAPSED_COOKIE(quizId))

        const cookieHeader = await getCookieHeader(cookieStore.getAll())
        const body = { quizAnswer: results.quizAnswer, timing, guest: results.guest }

        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/answer/${quizId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'cookie': cookieHeader },
            body: JSON.stringify(body),
        })

        const res = await response.json()
        // errData: o erro com as três línguas, para a tela mostrar no idioma de quem joga
        if (!response.ok) return { err: res.message as string, errData: res as { message?: string, messagePT?: string, messageES?: string } }

        // personalidade: a contagem de resultados do quiz mudou (aba "Resultados")
        if (res.personality) updateTag(quizTag(quizId))
        // review: só na prova (correção com as explicações)
        return {
            res: res.score,
            review: res.review as IExamReviewQuestion[] | undefined,
            // personalidade: no lugar da nota vem o perfil
            personality: res.personality as IPersonalityOutcome | undefined,
        }
    } catch (err) {
        throw err
    }
}
