'use server'

import ApiData from "@/utils/ApiData"
import { getCookieHeader } from "@/utils/getCookieHeader"
import { cookies } from "next/headers"

export const deleteQuiz = async (quizId: string) => {
    try {
        const cookieStore = await cookies()
        const cookieHeader = getCookieHeader(cookieStore.getAll())

        const externalApiResponse = await ApiData({
            path: `quiz/${quizId}`,
            method: 'DELETE',
            headerKey: 'Cookie',
            headerValue: cookieHeader,
            cache: { cache: 'no-store' }
        })
        if (!externalApiResponse.ok) throw new Error('An error occurred')
        return await externalApiResponse.json()
    } catch (err) {
        throw err
    }
}