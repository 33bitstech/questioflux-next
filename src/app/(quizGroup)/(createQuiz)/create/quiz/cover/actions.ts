'use server'

import { env } from "@/env"
import { BodyInit } from "@/types/fetchTypes"

export async function createQuiz(quiz:BodyInit, token: string) {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz`, {
            method: 'POST',
            headers: {
                'Authorization': `${token}`
            },
            body:quiz
        })
        const res = await response.json()

        if (!response.ok) return {err:res}
        return {res:res.data, warning: res.errImage}
    
    } catch (err:any) {
        throw err
    }
}
