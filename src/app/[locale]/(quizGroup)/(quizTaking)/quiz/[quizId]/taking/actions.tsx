'use server'

import { env } from "@/env"
import { getCookieHeader } from "@/utils/getCookieHeader"
import { cookies } from "next/headers"

const START_COOKIE   = (id: string) => `quiz_start_${id}`
const ELAPSED_COOKIE = (id: string) => `quiz_elapsed_${id}`
const COOKIE_OPTIONS = { httpOnly: true, sameSite: 'strict' as const, path: '/', maxAge: 60 * 60 }

/** Called when the user clicks "Start" — records the real start timestamp. */
export async function startQuiz(quizId: string): Promise<{ ok: boolean }> {
    const cookieStore = await cookies()
    cookieStore.set(START_COOKIE(quizId), String(Date.now()), COOKIE_OPTIONS)
    return { ok: true }
}

/**
 * Called the instant the user finishes answering (before the login/guest popup).
 * Freezes the elapsed time server-side so the popup delay is never counted.
 */
export async function pauseQuiz(quizId: string): Promise<{ ok: boolean }> {
    const cookieStore = await cookies()
    const startCookie = cookieStore.get(START_COOKIE(quizId))

    if (!startCookie?.value) return { ok: false }

    const elapsed = Date.now() - Number(startCookie.value)
    cookieStore.delete(START_COOKIE(quizId))
    cookieStore.set(ELAPSED_COOKIE(quizId), String(elapsed), COOKIE_OPTIONS)
    return { ok: true }
}

/** Called after login/guest — submits answers with the frozen timing. */
export async function takeQuiz(quizId: string, results: { quizAnswer: any; guest?: string }) {
    try {
        const cookieStore = await cookies()

        const elapsedCookie = cookieStore.get(ELAPSED_COOKIE(quizId))
        if (!elapsedCookie?.value) {
            return { err: 'Quiz session not found. Please start the quiz again.' }
        }
        const timing = Number(elapsedCookie.value)
        if (isNaN(timing) || timing <= 0) {
            return { err: 'Invalid quiz session. Please start the quiz again.' }
        }
        cookieStore.delete(ELAPSED_COOKIE(quizId))

        const cookieHeader = await getCookieHeader(cookieStore.getAll())
        const body = { quizAnswer: results.quizAnswer, timing, guest: results.guest }

        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/answer/${quizId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'cookie': cookieHeader },
            body: JSON.stringify(body),
        })

        const res = await response.json()
        if (!response.ok) return { err: res.message }
        return { res: res.score }
    } catch (err) {
        throw err
    }
}