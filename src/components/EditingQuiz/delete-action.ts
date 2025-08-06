'use server'

import ApiData from "@/utils/ApiData"

export const deleteQuiz = async (quizId: string, token: string) => {
    try {
        const externalApiResponse = await ApiData({
            path: `quiz/${quizId}`, 
            method: 'DELETE',
            headerKey: 'Authorization',
            headerValue: token,
            cache: {cache: 'no-store'}
        })
        if(!externalApiResponse.ok) throw new Error('An error ocurred')

        const response = await externalApiResponse.json()
    
        return response
    } catch (err) {
        throw err
    }
}