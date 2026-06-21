'use server'
import { env } from "@/env"

export async function confirmEmailChange(token: string) {
    const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_API}/email-by-token`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
    })
    console.log(response)
    if (!response.ok) {
        return { err: true }
    }

    return { success: true }
}