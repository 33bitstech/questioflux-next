'use server'

import { env } from "@/env"
import IReplies from "@/interfaces/IReplies"
import { CookieValueTypes } from "cookies-next"
import { revalidatePath } from "next/cache"

export async function verifyUserPremium(token:string) {
    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/user/verify-premium`, {
        method: 'GET',
        headers: {
            'Authorization': `${token}`
        }
    })

    const res = await response.json()

    if (!response.ok) return {err: res.message}

    revalidatePath(`/profile/config`)

    return {premium: res}
}
export async function cancelSubscription(token:string) {
    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/user/cancel-subscription`, {
        method: 'DELETE',
        headers: {
            'Authorization': `${token}`
        }
    })

    const res = await response.json()

    if (!response.ok) return {err: res.message}

    revalidatePath(`/profile/config`)
}
export async function deleteUser(token:string) {
    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/user/delete`, {
        method: 'DELETE',
        headers: {
            'Authorization': `${token}`
        }
    })

    const res = await response.json()

    if (!response.ok) return {err: res.message}
}