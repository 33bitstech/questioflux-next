import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';

export async function POST(request: Request) {
    const response = NextResponse.json({ ok: true }, { status: 200 });

    try {
        const cookieHeader = request.headers.get('cookie') || '';

        const apiResponse = await ApiData({
            path: 'logout',
            method: 'POST',
            headerKey: 'Cookie',
            headerValue: cookieHeader,
            cache: { cache: 'no-store' },
        });

        const setCookies = apiResponse.headers.getSetCookie?.() ?? [];
        setCookies.forEach(cookie => {
            response.headers.append('Set-Cookie', cookie);
        });

        const authCookieNames = ['token', 'session', 'access_token', 'refresh_token', 'logged_in', 'fghdhdhd'];
        const cookieOptions = [
            { path: '/' },
            { path: '/', domain: request.headers.get('host')?.split(':')[0] ?? undefined },
        ];

        for (const name of authCookieNames) {
            for (const opts of cookieOptions) {
                response.cookies.set(name, '', { ...opts, maxAge: 0 });
            }
        }

    } catch (error) {
        console.error('[API ROUTE /api/auth/logout] Erro inesperado:', error);

        const authCookieNames = ['token', 'session', 'access_token', 'refresh_token', 'logged_in', 'fghdhdhd'];
        for (const name of authCookieNames) {
            response.cookies.set(name, '', { path: '/', maxAge: 0 });
        }
    }

    return response;
}