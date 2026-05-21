'use server'

import { env } from "@/env"
import { getCookieHeader } from "@/utils/getCookieHeader"
import { BodyInit } from "@/types/fetchTypes"
import { cookies } from "next/headers"

export async function editQuiz(quiz: BodyInit, quizId: string) {
    try {
        const cookieStore = await cookies()
        const cookieHeader = getCookieHeader(cookieStore.getAll())

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