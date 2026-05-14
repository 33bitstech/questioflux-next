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

        // Repassa todos os Set-Cookie da API externa pro browser
        const setCookie = externalApiResponse.headers.get('set-cookie');
        if (setCookie) {
            response.headers.set('set-cookie', setCookie);
        }

        // Cookie indicador para o middleware (não-HttpOnly, apenas booleano)
        response.cookies.set('logged_in', 'true', {
            path: '/',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 dias
        });

        return response;
    } catch (error) {
        console.error('[API ROUTE /api/login] Erro inesperado:', error);
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' },
            { status: 500 }
        );
    }
}