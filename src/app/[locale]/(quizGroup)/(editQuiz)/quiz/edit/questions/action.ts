'use server'

import { IFormatedImageQuestions } from "@/components/CreatingQuiz/Questions/form-create-questions"
import { IArraysToUpdate } from "@/components/EditingQuiz/form-edit-questions"
import { env } from "@/env"
import { ILocalQuestions } from "@/interfaces/ILocalQuestions"
import { getCookieHeader } from "@/utils/getCookieHeader"
import { cookies } from "next/headers"

type MapAlternatives = Map<string, File | string>

export async function updateQuestionsImage(
    quizId: string,
    questions: ILocalQuestions[],
    questionsFormated: { questions: IFormatedImageQuestions[] },
    dataToSend: IArraysToUpdate
) {
    try {
        const cookieStore = await cookies()
        const cookieHeader = getCookieHeader(cookieStore.getAll())

        console.log(JSON.stringify(questionsFormated, null, 2))
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/create/questions/images/titles/${quizId}`, {
            method: 'PUT',
            headers: {
                cookie: cookieHeader,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(questionsFormated)
        })

        const res = await response.json()

        if (!response.ok) {
            return {
                err: {
                    data: res
                }
            }
        }

        if (dataToSend.questionsToUpdate.length > 0) {
            const imageDatas = new FormData()

            dataToSend.questionsToUpdate.forEach(q => {
                const question = questions.find(quest => quest.id === q.questionId)

                if (question?.image) {
                    imageDatas.append('quizQuestions', question.image)
                    imageDatas.append('imagesToUpdate', JSON.stringify(q))
                }
            })

            const responseThumb = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/create/questions/images/thumbs/${quizId}`, {
                method: 'PUT',
                headers: {
                    cookie: cookieHeader
                },
                body: imageDatas
            })

            const resThumb = await responseThumb.json()

            if (!responseThumb.ok) {
                return {
                    err: {
                        data: resThumb
                    }
                }
            }
        }

        const alternativesFormDataMap = new Map<string, MapAlternatives>()

        dataToSend.alternativesToUpdate.forEach((a) => {
            if (!alternativesFormDataMap.has(a.questionId)) {
                alternativesFormDataMap.set(a.questionId, new Map())
            }

            alternativesFormDataMap.get(a.questionId)!.set(a.id, a.file)
        })

        const reqs = Array.from(alternativesFormDataMap.entries()).map(async ([questionId, alternatives]) => {
            const formDataAlternativesImages = new FormData()

            alternatives.forEach((file, id) => {
                formDataAlternativesImages.append('imagesToUpdate', JSON.stringify({ answer: id }))
                formDataAlternativesImages.append('questionAlternatives', file)
            })

            const responseAlt = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/create/questions/images/alternatives/${quizId}/${questionId}`, {
                method: 'PUT',
                headers: {
                    cookie: cookieHeader
                },
                body: formDataAlternativesImages
            })

            const resAlt = await responseAlt.json()

            return {
                ok: responseAlt.ok,
                data: resAlt
            }
        })

        const finalRes = await Promise.all(reqs)

        const firstAlternativeError = finalRes.find(result => !result.ok)

        if (firstAlternativeError) {
            return {
                err: {
                    data: firstAlternativeError.data
                }
            }
        }

        return {
            res: finalRes.map(result => result.data)
        }
    } catch (err: any) {
        return {
            err: {
                data: {
                    type: 'server',
                    message: err?.message || 'An unexpected error occurred',
                    messagePT: 'Ocorreu um erro inesperado'
                }
            }
        }
    }
}