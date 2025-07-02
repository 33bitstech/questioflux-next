'use server'

import { IFormatedImageQuestions } from "@/components/CreatingQuiz/Questions/form-create-questions"
import { env } from "@/env"
import { ILocalQuestions } from "@/interfaces/ILocalQuestions"
import { BodyInit } from "@/types/fetchTypes"

export async function createQuestionsText(token:string, questions: BodyInit, quizId: string) {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/create/questions/${quizId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `${token}`
            },
            body:questions
        })
        const res = await response.json()

        if (!response.ok) return {err:res}
        return {res:res.data}
    
    } catch (err:any) {
        throw err
    }
}
export async function createQuestionsImage(token:string, quizId:string, questions: ILocalQuestions[], questionsFormated: {questions: IFormatedImageQuestions[]} ) {
    try {
        //enviar o questionsFormated(questionsFormated, quizId, token)
        //PUT - `questions-images/${quizId}`
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/create/questions/${quizId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `${token}`
            },
        })
        const res = await response.json()

        if (!response.ok) return {err:res}

        const questionsImagesFormdata = new FormData()
        questions.forEach(q => {
            if (q.image !== undefined) {
                questionsImagesFormdata.append('quizQuestions', q.image)
            }
        })
        //enviar esse formdata para 
        //POST - `questions-thumbnail/${quizId}`,

        const reqs = questions.map(async (q)=>{
            const alternativesImagesFormdata = new FormData()

            q.alternatives.forEach(alt=>{
                if (alt.thumbnail !== undefined) {
                    alternativesImagesFormdata.append('questionAlternatives', alt.thumbnail)
                }
            })
            return await (1) // POST - `quiz-images-alternatives/${quizId}/${questionId}`
        })

        const finalRes = await Promise.all(reqs)

        return {res:res.data}
    
    } catch (err:any) {
        throw err
    }
}
