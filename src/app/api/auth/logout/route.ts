import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';

export async function POST(request: Request) {
    try {
        const cookieHeader = request.headers.get('cookie') || '';

        const apiResponse = await ApiData({  
            path: 'logout',
            method: 'POST',
            headerKey: 'Cookie',
            headerValue: cookieHeader,
            cache: { cache: 'no-store' },
        });

        const response = NextResponse.json({ ok: true }, { status: 200 });

        const setCookies = apiResponse.headers.getSetCookie?.() ?? [];
        setCookies.forEach(cookie => {
            response.headers.append('Set-Cookie', cookie);
        });

        response.cookies.set('logged_in', '', { path: '/', maxAge: 0 });
        response.cookies.set('fghdhdhd', '', { path: '/', maxAge: 0 });

        return response;
    } catch (error) {
        console.error('[API ROUTE /api/auth/logout] Erro inesperado:', error);
        const response = NextResponse.json({ ok: true }, { status: 200 });
        response.cookies.set('logged_in', '', { path: '/', maxAge: 0 });
        return response;
    }
}