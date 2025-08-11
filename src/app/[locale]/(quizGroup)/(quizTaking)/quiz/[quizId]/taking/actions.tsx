'use server'

import { env } from "@/env"

export async function takeQuiz(quizId: string, results: object, token:string|undefined) {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/answer/${quizId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token || ''
            },
            body: JSON.stringify(results)
        })

        const res = await response.json()

        if (!response.ok) return {err: res.message}

        return {res: res.score}
    } catch (err) {
        throw err
    }

}