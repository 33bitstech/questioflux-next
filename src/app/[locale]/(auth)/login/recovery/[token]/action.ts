'use server'

import { env } from "@/env"

export async function changePasswordByToken(email: string, token:string, password: string) {
    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/recovery/change-password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, token, password})
    })

    const res = await response.json()

    if (!response.ok) return {err: {...res}}

    return {ok: true}
}
