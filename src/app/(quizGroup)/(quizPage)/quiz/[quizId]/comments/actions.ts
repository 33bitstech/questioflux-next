'use server'

import { env } from "@/env"
import IReplies from "@/interfaces/IReplies"
import { CookieValueTypes } from "cookies-next"
import { revalidatePath } from "next/cache"

export async function createComment(quizId: string, data: object, token: CookieValueTypes) {
    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/${quizId}/comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        body: JSON.stringify(data)
    })

    const res = await response.json()

    if (!response.ok) return {err: res.message}

    revalidatePath(`/quiz/${quizId}/comments`)
}
export async function deleteComment(quizId: string, commentId: string, data: object, token: CookieValueTypes) {

    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/comment/delete/${commentId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        body: JSON.stringify(data)
    })
    const res = await response.json()

    if (!response.ok) return {err: res.message}

    revalidatePath(`/quiz/${quizId}/comments`)
}
export async function editComment(quizId: string, commentId: string, data: object, token: CookieValueTypes) {

    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/comment/edit/${commentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        body: JSON.stringify(data)
    })
    const res = await response.json()

    if (!response.ok) return {err: res.message}

    revalidatePath(`/quiz/${quizId}/comments`)
}
export async function likeComment(commentId: string, token: CookieValueTypes) {

    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/comment/like/${commentId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `${token}`
        },
    })
    const res = await response.json()

    if (!response.ok) return {err: res.message}

}
export async function dislikeComment(commentId: string, token: CookieValueTypes) {

    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/comment/dislike/${commentId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `${token}`
        },
    })
    const res = await response.json()

    if (!response.ok) return {err: res.message}

}
export async function replyComment(quizId:string, commentId: string, data: object, token: CookieValueTypes) {
    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/reply/${commentId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        body: JSON.stringify(data)
    })

    const res = await response.json()

    if (!response.ok) return {err: res.message}

    revalidatePath(`/quiz/${quizId}/comments`)
}

export async function repliesFromComment(quizId:string, commentId: string) : Promise<IReplies[]|undefined>{
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/reply/${commentId}`, {
            method: 'GET'
        })
        
        if (!response.ok) throw new Error('Ocorreu um erro')

        const res = await response.json()
    
        revalidatePath(`/quiz/${quizId}/comments`)
        return res.repliesMargedArray
    } catch (err) {
        console.log(err)
    }
}