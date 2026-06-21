'use server'
import { env } from "@/env"
import { getCookieHeader } from "@/utils/getCookieHeader"
import { cookies } from "next/headers"

export async function confirmEmailChange(token: string, email: string, locale: string) {
    const cookieStore = await cookies()
    const cookieHeader = getCookieHeader(cookieStore.getAll())

    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_API}/email-by-token?locale=${locale}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'cookie': cookieHeader
        },
        body: JSON.stringify({ token, email })
    })

    if (!response.ok) {
        return { err: true }
    }

    return { success: true }
}