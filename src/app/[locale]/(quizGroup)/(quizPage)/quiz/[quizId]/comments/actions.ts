'use server'

import { env } from "@/env"
import IReplies from "@/interfaces/IReplies"
import { getCookieHeader } from "@/utils/getCookieHeader"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export async function createComment(quizId: string, data: object) {
    const cookieStore = await cookies()
const cookieHeader = await getCookieHeader(cookieStore.getAll())
    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/${quizId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'cookie': cookieHeader },
        body: JSON.stringify(data),
    })
    const res = await response.json()
    if (!response.ok) return { err: res.message }
    revalidatePath(`/quiz/${quizId}/comments`)
}

export async function deleteComment(quizId: string, commentId: string, data: object) {
    const cookieStore = await cookies()
const cookieHeader = await getCookieHeader(cookieStore.getAll())
    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/comment/delete/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'cookie': cookieHeader },
        body: JSON.stringify(data),
    })
    const res = await response.json()
    if (!response.ok) return { err: res.message }
    revalidatePath(`/quiz/${quizId}/comments`)
}

export async function editComment(quizId: string, commentId: string, data: object) {
    const cookieStore = await cookies()
const cookieHeader = await getCookieHeader(cookieStore.getAll())
    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/comment/edit/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'cookie': cookieHeader },
        body: JSON.stringify(data),
    })
    const res = await response.json()
    if (!response.ok) return { err: res.message }
    revalidatePath(`/quiz/${quizId}/comments`)
}

export async function likeComment(commentId: string) {
    const cookieStore = await cookies()
const cookieHeader = await getCookieHeader(cookieStore.getAll())
    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/comment/like/${commentId}`, {
        method: 'PUT',
        headers: { 'cookie': cookieHeader },
    })
    const res = await response.json()
    if (!response.ok) return { err: res.message }
}

export async function dislikeComment(commentId: string) {
    const cookieStore = await cookies()
const cookieHeader = await getCookieHeader(cookieStore.getAll())
    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/comment/dislike/${commentId}`, {
        method: 'DELETE',
        headers: { 'cookie': cookieHeader },
    })
    const res = await response.json()
    if (!response.ok) return { err: res.message }
}

export async function replyComment(quizId: string, commentId: string, data: object) {
    const cookieStore = await cookies()
const cookieHeader = await getCookieHeader(cookieStore.getAll())
    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/reply/${commentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'cookie': cookieHeader },
        body: JSON.stringify(data),
    })
    const res = await response.json()
    if (!response.ok) return { err: res.message }
    revalidatePath(`/quiz/${quizId}/comments`)
}

export async function repliesFromComment(quizId: string, commentId: string): Promise<IReplies[] | undefined> {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/reply/${commentId}`, { method: 'GET' })
        if (!response.ok) throw new Error('Ocorreu um erro')
        const res = await response.json()
        return res.repliesMargedArray
    } catch (err) {
        console.log(err)
    }
}

export async function deleteReply(quizId: string, commentId: string, replyId: string, data: object) {
    const cookieStore = await cookies()
const cookieHeader = await getCookieHeader(cookieStore.getAll())
    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/reply/${commentId}/${replyId}/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'cookie': cookieHeader },
        body: JSON.stringify(data),
    })
    const res = await response.json()
    if (!response.ok) return { err: res.message }
    revalidatePath(`/quiz/${quizId}/comments`)
}

export async function editReply(quizId: string, commentId: string, replyId: string, data: object) {
    const cookieStore = await cookies()
const cookieHeader = await getCookieHeader(cookieStore.getAll())
    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/reply/${commentId}/${replyId}/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'cookie': cookieHeader },
        body: JSON.stringify(data),
    })
    const res = await response.json()
    if (!response.ok) return { err: res.message }
    revalidatePath(`/quiz/${quizId}/comments`)
}

export async function likeReply(commentId: string, replyId: string) {
    const cookieStore = await cookies()
const cookieHeader = await getCookieHeader(cookieStore.getAll())
    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/reply/${commentId}/${replyId}/like`, {
        method: 'PUT',
        headers: { 'cookie': cookieHeader },
    })
    const res = await response.json()
    if (!response.ok) return { err: res.message }
}

export async function dislikeReply(commentId: string, replyId: string) {
    const cookieStore = await cookies()
const cookieHeader = await getCookieHeader(cookieStore.getAll())
    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/reply/${commentId}/${replyId}/dislike`, {
        method: 'DELETE',
        headers: { 'cookie': cookieHeader },
    })
    const res = await response.json()
    if (!response.ok) return { err: res.message }
}