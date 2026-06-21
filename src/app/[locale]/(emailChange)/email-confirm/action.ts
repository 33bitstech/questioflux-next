'use server'
import { env } from "@/env"
import { getCookieHeader } from "@/utils/getCookieHeader"
import { cookies } from "next/headers"

export async function confirmEmailChange(token: string) {
    const cookieStore = await cookies()
    const cookieHeader = getCookieHeader(cookieStore.getAll())

    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_API}/email-by-token`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'cookie': cookieHeader
        },
        body: JSON.stringify({ token })
    })

    if (!response.ok) {
        return { err: true }
    }

    return { success: true }
}