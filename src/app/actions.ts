'use server'

import { env } from "@/env"
import ApiData from "@/utils/ApiData"

export async function getAllQuizzes() {
    const response = await ApiData({
        path: 'public-quizzes', 
        method: 'GET',
        cache: { cache: 'no-store' },
    });
    
    if (!response.ok) {
        const err = await response.text()
        console.error(`erro || ${err}`)
        throw new Error(err)
    }
    const res = await response.json()


    return res.quizzes
}
export async function getUsers() {
    const response = await ApiData({
        path: 'users', 
        method: 'GET',
        cache: { cache: 'no-store' },
    });

    if (!response.ok) {
        const err = await response.text()
        console.error(`erro || ${err}`)
        throw new Error(err)
    }

    const res = await response.json()

    return res.users
}