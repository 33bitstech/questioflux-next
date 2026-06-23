'use server'

import { env } from '@/env'
import { getCookieHeader } from '@/utils/getCookieHeader'
import { cookies } from 'next/headers'

export async function confirmEmailChange(token: string, email: string) {
    const cookieStore = await cookies()
    const cookieHeader = getCookieHeader(cookieStore.getAll())

    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_API}/email-by-token`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'cookie': cookieHeader
        },
        body: JSON.stringify({ token, email })
    })

    if (!response.ok) return { err: true }

    response.headers.getSetCookie().forEach(cookie => {
        const [name, value] = cookie.split(';')[0].split('=')

        cookieStore.set(name, value, {
            path: '/',
            httpOnly: true
        })
    })

    cookieStore.set('logged_in', 'true', {
        path: '/',
        sameSite: 'lax',
        maxAge: 604800
    })

    return { success: true }
}