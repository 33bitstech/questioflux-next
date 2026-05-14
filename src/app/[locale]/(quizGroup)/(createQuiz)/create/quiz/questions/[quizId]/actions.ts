'use server'

import { IFormatedImageQuestions } from "@/components/CreatingQuiz/Questions/form-create-questions"
import { env } from "@/env"
import { ILocalQuestions } from "@/interfaces/ILocalQuestions"
import { getCookieHeader } from "@/utils/getCookieHeader"
import { BodyInit } from "@/types/fetchTypes"
import { cookies } from "next/headers"

export async function createQuestionsText(questions: BodyInit, quizId: string) {
    try {
        const cookieStore = await cookies()
const cookieHeader = await getCookieHeader(cookieStore.getAll())

        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/create/questions/${quizId}`, {
            method: 'PUT',
            headers: { 'cookie': cookieHeader },
            body: questions,
        })
        const res = await response.json()

        if (!response.ok) return { err: res }
        return { res: res.data }
    } catch (err: any) {
        throw err
    }
}

export async function createQuestionsImage(quizId: string, questions: ILocalQuestions[], questionsFormated: { questions: IFormatedImageQuestions[] }) {
    try {
        const cookieStore = await cookies()
const cookieHeader = await getCookieHeader(cookieStore.getAll())

        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/create/questions/images/titles/${quizId}`, {
            method: 'PUT',
            headers: { 'cookie': cookieHeader, 'Content-Type': 'application/json' },
            body: JSON.stringify(questionsFormated),
        })
        const res = await response.json()
        if (!response.ok) return { err: res }

        const questionsImagesFormdata = new FormData()
        questions.forEach(q => {
            if (q.image !== undefined) questionsImagesFormdata.append('quizQuestions', q.image)
        })

        const responseThumb = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/create/questions/images/thumbs/${quizId}`, {
            method: 'POST',
            headers: { 'cookie': cookieHeader },
            body: questionsImagesFormdata,
        })
        const resThumb = await responseThumb.json()
        if (!responseThumb.ok) return { err: resThumb }

        const reqs = questions.map(async (q) => {
            const alternativesImagesFormdata = new FormData()
            q.alternatives.forEach(alt => {
                if (alt.thumbnail !== undefined) alternativesImagesFormdata.append('questionAlternatives', alt.thumbnail)
            })
            const responseAlt = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/create/questions/images/alternatives/${quizId}/${q.id}`, {
                method: 'POST',
                headers: { 'cookie': cookieHeader },
                body: alternativesImagesFormdata,
            })
            const resAlt = await responseAlt.json()
            if (!responseAlt.ok) return { err: resAlt }
            return resAlt
        })

        const finalRes = await Promise.all(reqs)
        return { res: finalRes }
    } catch (err: any) {
        throw err
    }
}