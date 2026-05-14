import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';

export async function POST(request: Request) {
    try {
        const cookieHeader = request.headers.get('cookie') || '';

        await ApiData({
            path: 'logout',
            method: 'POST',
            headerKey: 'Cookie',
            headerValue: cookieHeader,
            cache: { cache: 'no-store' },
        }).catch(() => {}); 

        const response = NextResponse.json({ ok: true }, { status: 200 });

        response.cookies.set('logged_in', '', { path: '/', maxAge: 0 });

        return response;
    } catch (error) {
        console.error('[API ROUTE /api/auth/logout] Erro inesperado:', error);
        return NextResponse.json({ ok: true }, { status: 200 });
    }
}