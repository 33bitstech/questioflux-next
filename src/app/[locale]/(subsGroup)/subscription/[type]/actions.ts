'use server'

import { env } from "@/env"
import { getCookieHeader } from "@/utils/getCookieHeader"
import { cookies } from "next/headers"

async function getCookies() {
    const cookieStore = await cookies()
    return getCookieHeader(cookieStore.getAll())
}

export async function getPublicKey() {
    try {
        const cookieHeader = await getCookies()
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/subscription/public-key`, {
            method: 'GET',
            headers: { 'cookie': cookieHeader }
        })
        const res = await response.json()
        if (!response.ok) return { err: res }
        return { res }
    } catch (err: any) {
        throw err
    }
}

export async function clientSecretUsage({locale}:{locale:string}) {
    try {
        const cookieHeader = await getCookies()
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/subscription/${locale}/client-secret`, {
            method: 'POST',
            headers: { 'cookie': cookieHeader }
        })
        const res = await response.json()
        if (!response.ok) return { err: res }
        return { res }
    } catch (err: any) {
        throw err
    }
}

export async function clientSessionAss({locale}:{locale:string}) {
    try {
        const cookieHeader = await getCookies()
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/subscription/${locale}/client-session`, {
            method: 'POST',
            headers: { 'cookie': cookieHeader }
        })
        const res = await response.json()
        if (!response.ok) return { err: res }
        return { res }
    } catch (err: any) {
        throw err
    }
}

export async function subscribe(sessionId: string) {
    try {
        const cookieHeader = await getCookies()
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/subscription/subscribe`, {
            method: 'POST',
            headers: { 'cookie': cookieHeader, 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId })
        })
        const res = await response.json()
        if (!response.ok) return { err: res }
        return { res }
    } catch (err: any) {
        throw err
    }
}

export async function payOnce(sessionId: string) {
    try {
        const cookieHeader = await getCookies()
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/subscription/pay-once`, {
            method: 'POST',
            headers: { 'cookie': cookieHeader, 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId })
        })
        const res = await response.json()
        if (!response.ok) return { err: res }
        return { res }
    } catch (err: any) {
        throw err
    }
}

export async function getCheckoutSessionStatus(sessionId: string) {
    try {
        const cookieHeader = await getCookies()

        const response = await fetch(
            `${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/subscription/checkout-session-status?session_id=${sessionId}`,
            {
                method: 'GET',
                headers: {
                    cookie: cookieHeader
                }
            }
        )

        const res = await response.json()

        if (!response.ok) return { err: res }

        return { res }
    } catch (err: any) {
        throw err
    }
}