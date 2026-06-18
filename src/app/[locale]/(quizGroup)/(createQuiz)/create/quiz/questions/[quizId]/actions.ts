'use server'

import type { IFormatedImageQuestions } from "@/components/CreatingQuiz/Questions/form-create-questions"
import { env } from "@/env"
import { ILocalQuestions } from "@/interfaces/ILocalQuestions"
import { getCookieHeader } from "@/utils/getCookieHeader"
import { BodyInit } from "@/types/fetchTypes"
import { cookies } from "next/headers"

export async function createQuestionsText(questions: BodyInit, quizId: string) {
    try {
        const cookieStore = await cookies()
        const cookieHeader = getCookieHeader(cookieStore.getAll())

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

export async function createQuestionsImageTitles(
    quizId: string,
    questionsFormated: { questions: IFormatedImageQuestions[] }
) {
    try {
        const cookieStore = await cookies()
        const cookieHeader = getCookieHeader(cookieStore.getAll())

        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/create/questions/images/titles/${quizId}`, {
            method: 'PUT',
            headers: {
                'cookie': cookieHeader,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(questionsFormated),
        })

        const res = await response.json()

        if (!response.ok) return { err: res }

        return { res: res.data || true }
    } catch (err: any) {
        throw err
    }
}

export async function uploadOneQuestionImage(
    quizId: string,
    question: ILocalQuestions
) {
    try {
        const cookieStore = await cookies()
        const cookieHeader = getCookieHeader(cookieStore.getAll())

        if (question.image !== undefined) {
            const questionImageFormData = new FormData()

            questionImageFormData.append('quizQuestions', question.image)
            questionImageFormData.append('imagesToUpdate', JSON.stringify({
                questionId: question.id,
            }))

            const responseThumb = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/create/questions/images/thumbs/${quizId}`, {
                method: 'PUT',
                headers: { 'cookie': cookieHeader },
                body: questionImageFormData,
            })

            const resThumb = await responseThumb.json()

            if (!responseThumb.ok) return { err: resThumb }
        }

        const alternativesImagesFormData = new FormData()
        let hasAlternativeImagesToUpload = false

        question.alternatives.forEach((alt) => {
            if (alt.thumbnail !== undefined) {
                alternativesImagesFormData.append('imagesToUpdate', JSON.stringify({
                    answer: alt.id,
                }))

                alternativesImagesFormData.append('questionAlternatives', alt.thumbnail)
                hasAlternativeImagesToUpload = true
            }
        })

        if (hasAlternativeImagesToUpload) {
            const responseAlt = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/create/questions/images/alternatives/${quizId}/${question.id}`, {
                method: 'PUT',
                headers: { 'cookie': cookieHeader },
                body: alternativesImagesFormData,
            })

            const resAlt = await responseAlt.json()

            if (!responseAlt.ok) return { err: resAlt }
        }

        return { res: true }
    } catch (err: any) {
        throw err
    }
}