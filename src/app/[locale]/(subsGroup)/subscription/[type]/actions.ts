'use server'

import { env } from "@/env"

export async function getPublicKey(token: string) {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/subscription/public-key`, {
            method: 'GET',
            headers: {
                'Authorization': `${token}`
            }
        })
        const res = await response.json()

        if (!response.ok) return {err:res}
        return {res}
    
    } catch (err:any) {
        throw err
    }
}
export async function clientSecretUsage(token: string) {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/subscription/client-secret`, {
            method: 'POST',
            headers: {
                'Authorization': `${token}`
            }
        })
        const res = await response.json()

        if (!response.ok) return {err:res}
        return {res}
    
    } catch (err:any) {
        throw err
    }
}
export async function clientSessionAss(token: string) {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/subscription/client-session`, {
            method: 'POST',
            headers: {
                'Authorization': `${token}`
            }
        })
        const res = await response.json()

        if (!response.ok) return {err:res}
        return {res}
    
    } catch (err:any) {
        throw err
    }
}
export async function subscribe(sessionId:string, token: string) {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/subscription/subscribe`, {
            method: 'POST',
            headers: {
                'Authorization': `${token}`,
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({sessionId})
        })
        const res = await response.json()

        if (!response.ok) return {err:res}
        return {res}
    
    } catch (err:any) {
        throw err
    }
}
export async function payOnce(sessionId:string, token: string) {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/subscription/pay-once`, {
            method: 'POST',
            headers: {
                'Authorization': `${token}`,
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({sessionId})
        })
        const res = await response.json()

        if (!response.ok) return {err:res}
        return {res}
    
    } catch (err:any) {
        throw err
    }
}
