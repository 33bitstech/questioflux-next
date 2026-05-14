import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';

export async function DELETE(request: Request) {
    try {
        const cookieHeader = request.headers.get('cookie') || '';

        const externalApiResponse = await ApiData({
            path: 'user',
            method: 'DELETE',
            headerKey: 'Cookie',
            headerValue: cookieHeader,
            cache: { cache: 'no-store' },
        });

        const responseData = await externalApiResponse.json();

        if (!externalApiResponse.ok) {
            return NextResponse.json(responseData, { status: externalApiResponse.status });
        }

        const response = NextResponse.json(responseData, { status: 200 });
        response.cookies.set('logged_in', '', { path: '/', maxAge: 0 });
        return response;
    } catch (error) {
        console.error('[API ROUTE /api/user/delete] Erro inesperado:', error);
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' },
            { status: 500 }
        );
    }
}