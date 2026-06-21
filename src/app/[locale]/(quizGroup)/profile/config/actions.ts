'use server'

import { env } from "@/env"
import { getCookieHeader } from "@/utils/getCookieHeader"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export async function verifyUserPremium(revalidate: boolean = true) {
    const cookieStore = await cookies()
    const cookieHeader = getCookieHeader(cookieStore.getAll())

    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/user/verify-premium`, {
        method: 'GET',
        headers: { 'cookie': cookieHeader },
        cache: "no-store"
    })

    const res = await response.json()
    if (!response.ok) return { err: res.message }
    if (revalidate) revalidatePath('/profile/config')
    return { premium: res }
}

export async function cancelSubscription() {
    const cookieStore = await cookies()
    const cookieHeader = getCookieHeader(cookieStore.getAll())

    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/user/cancel-subscription`, {
        method: 'DELETE',
        headers: { 'cookie': cookieHeader },
    })

    const res = await response.json()

    if (!response.ok) {
        return { err: res.message }
    }

    revalidatePath('/profile/config')

    return { data: res }
}

export async function deleteUser() {
    const cookieStore = await cookies()
    const cookieHeader = getCookieHeader(cookieStore.getAll())

    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/user/delete`, {
        method: 'DELETE',
        headers: { 'cookie': cookieHeader },
    })

    const res = await response.json()
    if (!response.ok) return { err: res.message }
}
export async function createPortalSession(locale: string) {
    const cookieStore = await cookies()
    const cookieHeader = getCookieHeader(cookieStore.getAll())

    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_API}/payments/portal`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'cookie': cookieHeader
        },
    })

    const res = await response.json()

    if (!response.ok) {
        let errorMessage = res.message || 'Error accessing the payment portal'

        if (locale === 'pt') {
            errorMessage = res.messagePT || 'Erro ao acessar o portal de pagamento'
        } else if (locale === 'es') {
            errorMessage = res.messageES || 'Error al acceder al portal de pago'
        }

        return { err: errorMessage }
    }

    return { url: res.url }
}
export async function validateEmailCode(code: string, locale: string, email: string) {
    const cookieStore = await cookies()
    const cookieHeader = getCookieHeader(cookieStore.getAll())

    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_API}/user/email-code`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'cookie': cookieHeader
        },
        body: JSON.stringify({ code, email })
    })

    const res = await response.json()

    if (!response.ok) {
        let errorMessage = res.message || 'Error validating code'
        if (locale === 'pt') errorMessage = res.messagePT || 'Erro ao validar o código'
        if (locale === 'es') errorMessage = res.messageES || 'Error al validar el código'
        return { err: errorMessage }
    }

    return { success: true }
}

export async function reactivateSubscription(locale: string) {
    const cookieStore = await cookies()
    const cookieHeader = getCookieHeader(cookieStore.getAll())

    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_API}/subscription/reactive`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'cookie': cookieHeader
        }
    })

    const res = await response.json()

    if (!response.ok) {
        let errorMessage = res.message || 'Error reactivating subscription'
        if (locale === 'pt') errorMessage = res.messagePT || 'Erro ao reativar assinatura'
        if (locale === 'es') errorMessage = res.messageES || 'Error al reactivar suscripción'
        return { err: errorMessage }
    }

    revalidatePath('/profile/config')
    return { success: true }
}