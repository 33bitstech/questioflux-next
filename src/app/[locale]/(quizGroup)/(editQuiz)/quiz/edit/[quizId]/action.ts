'use server'

import { env } from "@/env"
import { getCookieHeader } from "@/utils/getCookieHeader"
import { BodyInit } from "@/types/fetchTypes"

export async function editQuiz(quiz: BodyInit, quizId: string) {
    try {
        const cookieHeader = await getCookieHeader()

        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/edit/${quizId}`, {
            method: 'PUT',
            headers: { 'cookie': cookieHeader },
            body: quiz,
        })
        const res = await response.json()

        if (!response.ok) return { err: res }
        return { res: res.data, warning: res.errImage }
    } catch (err: any) {
        throw err
    }
}