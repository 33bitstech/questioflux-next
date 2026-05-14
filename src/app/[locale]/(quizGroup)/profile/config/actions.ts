'use server'

import { env } from "@/env"
import { getCookieHeader } from "@/utils/getCookieHeader"
import { revalidatePath } from "next/cache"

export async function verifyUserPremium(revalidate: boolean = true) {
    const cookieHeader = await getCookieHeader()

    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/user/verify-premium`, {
        method: 'GET',
        headers: { 'cookie': cookieHeader },
    })

    const res = await response.json()
    if (!response.ok) return { err: res.message }
    if (revalidate) revalidatePath('/profile/config')
    return { premium: res }
}

export async function cancelSubscription() {
    const cookieHeader = await getCookieHeader()

    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/user/cancel-subscription`, {
        method: 'DELETE',
        headers: { 'cookie': cookieHeader },
    })

    const res = await response.json()
    if (!response.ok) return { err: res.message }
    revalidatePath('/profile/config')
}

export async function deleteUser() {
    const cookieHeader = await getCookieHeader()

    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/user/delete`, {
        method: 'DELETE',
        headers: { 'cookie': cookieHeader },
    })

    const res = await response.json()
    if (!response.ok) return { err: res.message }
}