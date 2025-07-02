'use server'

import { IFormatedImageQuestions } from "@/components/CreatingQuiz/Questions/form-create-questions"
import { IArraysToUpdate } from "@/components/EditingQuiz/form-edit-questions"
import { env } from "@/env"
import { ILocalQuestions } from "@/interfaces/ILocalQuestions"

export async function updateQuestionsImage(token:string, quizId:string, questions: ILocalQuestions[], questionsFormated: {questions: IFormatedImageQuestions[]}, dataToSend: IArraysToUpdate ) {
    try {

        const errors = []
        //enviar o questionsFormated(questionsFormated, quizId, token)
        //PUT - `questions-images/${quizId}`
        //enviando as perguntas das questões para a API
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/create/questions/images/titles/${quizId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(questionsFormated)
        })
        const res = await response.json()
        if(!response.ok) errors.push(res)

        if(dataToSend.questionsToUpdate.length > 0){
            const imageDatas = new FormData()
    
            dataToSend.questionsToUpdate.forEach(q=>{
                const question = questions.find(quest=>quest.id === q.questionId)
                if (question && question.image) {
                    imageDatas.append('quizQuestions', question.image)
                    imageDatas.append('imagesToUpdate', JSON.stringify(q))
                }
            })
            //enviar esse formdata para 
            //POST - `questions-thumbnail/${quizId}`,
    
            //enviando as imagens das questões para a API
            const responseThumb = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/create/questions/images/thumbs/${quizId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `${token}`
                },
                body: imageDatas
            })
            const resThumb = await responseThumb.json()
            if(!responseThumb.ok) errors.push(resThumb)
        }

        //enviando as imagens das alternativas para a API
        const reqs = dataToSend.alternativesToUpdate.map(async (a)=>{
            const alternativesImagesFormdata = new FormData()
            
            alternativesImagesFormdata.append('imagesToUpdate', JSON.stringify({answer:a.id}))
            alternativesImagesFormdata.append('questionAlternatives', a.file)

            const responseAlt = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/create/questions/images/alternatives/${quizId}/${a.questionId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `${token}`
                },
                body: alternativesImagesFormdata
            })
            const resAlt = await responseAlt.json()

            if (!responseAlt.ok){
                if(!responseAlt.ok) errors.push(resAlt)
                return
            }

            return resAlt // POST - `quiz-images-alternatives/${quizId}/${questionId}`
        })

        const finalRes = await Promise.all(reqs)

        return {res:finalRes}
    
    } catch (err:any) {
        throw err
    }
}
