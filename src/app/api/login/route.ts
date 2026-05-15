import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        const cookieHeader = request.headers.get('cookie') || '';

        const externalApiResponse = await ApiData({
            path: 'login',
            method: 'POST',
            body: JSON.stringify(body),
            headerKey: ['Content-Type', 'Cookie'],
            headerValue: ['application/json', cookieHeader],
            cache: { cache: 'no-store' },
        });

        const responseData = await externalApiResponse.json();

        if (!externalApiResponse.ok) {
            return NextResponse.json(responseData, { status: externalApiResponse.status });
        }

        const response = NextResponse.json(responseData, { status: 200 });

        const setCookies = externalApiResponse.headers.getSetCookie();
        if (setCookies && setCookies.length > 0) {
            setCookies.forEach(cookie => {
                response.headers.append('Set-Cookie', cookie);
            });
        }

        response.headers.append(
            'Set-Cookie',
            'logged_in=true; Path=/; SameSite=Lax; Max-Age=604800'
        );

        return response;
    } catch (error) {
        console.error('[API ROUTE /api/login] Erro inesperado:', error);
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' },
            { status: 500 }
        );
    }
}