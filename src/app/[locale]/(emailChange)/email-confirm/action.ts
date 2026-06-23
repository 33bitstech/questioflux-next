'use server'

import { env } from '@/env'
import { getCookieHeader } from '@/utils/getCookieHeader'
import { cookies } from 'next/headers'
import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

function parseAndSetCookies(setCookieStrings: string[], cookieStore: any) {
    setCookieStrings.forEach(cookieString => {
        const parts = cookieString.split(';');
        const nameValue = parts.shift()?.trim();

        if (!nameValue) return;

        const firstEqualIdx = nameValue.indexOf('=');
        const name = nameValue.slice(0, firstEqualIdx);
        const value = nameValue.slice(firstEqualIdx + 1);

        const options: Partial<ResponseCookie> = {
            path: '/'
        };

        parts.forEach(part => {
            const [key, ...valParts] = part.trim().split('=');
            const val = valParts.join('=');
            const keyLower = key.toLowerCase();

            if (keyLower === 'max-age') options.maxAge = parseInt(val, 10);
            else if (keyLower === 'expires') options.expires = new Date(val);
            else if (keyLower === 'samesite') options.sameSite = val.toLowerCase() as any;
            else if (keyLower === 'secure') options.secure = true;
            else if (keyLower === 'httponly') options.httpOnly = true;
        });

        cookieStore.set(name, value, options);
    });
}

export async function confirmEmailChange(token: string, email: string) {
    try {
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

        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            return { err: true, message: errorData?.message || 'Falha ao processar a requisição.' }
        }

        cookieStore.delete('fghdhdhd')

        const setCookies = response.headers.getSetCookie()

        if (setCookies && setCookies.length > 0) {
            parseAndSetCookies(setCookies, cookieStore)
        }

        cookieStore.set('logged_in', 'true', {
            path: '/',
            sameSite: 'lax',
            maxAge: 604800
        })

        return { success: true }

    } catch (error) {
        console.error('[ACTION confirmEmailChange] Erro:', error)
        return { err: true, message: 'Ocorreu um erro interno no servidor.' }
    }
}