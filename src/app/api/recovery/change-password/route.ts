import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        console.log(body)
        const externalApiResponse = await ApiData({
            path: `password-by-token`, 
            method: 'PUT',
            headerKey: ['Content-Type'],
            headerValue: ['application/json'],
            body: JSON.stringify(body),
            cache: {cache: 'no-store'}
        })
        console.log(externalApiResponse)

        
        if (!externalApiResponse.ok) {
            const responseData = await externalApiResponse.json();
            return NextResponse.json(responseData, { status: externalApiResponse.status });
        }
        

        return NextResponse.json('ok', { status: 200 });

    } catch (error) {
        console.error('[API ROUTE /api/recovery/change-password] Erro inesperado:', error);
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' }, 
            { status: 500 }
        );
    }
}