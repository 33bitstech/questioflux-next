import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';

export async function POST(request: Request) {
    try {
        const email = await request.json()

        const externalApiResponse = await ApiData({
            path: `recovery-token`, 
            method: 'POST',
            headerKey: ['Content-Type'],
            headerValue: ['application/json'],
            body: JSON.stringify(email),
            cache: {cache: 'no-store'}
        })
        console.log(externalApiResponse)

        
        if (!externalApiResponse.ok) {
            const responseData = await externalApiResponse.json();
            return NextResponse.json(responseData, { status: externalApiResponse.status });
        }
        

        return NextResponse.json('ok', { status: 200 });

    } catch (error) {
        console.error('[API ROUTE /api/recovery/token] Erro inesperado:', error);
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' }, 
            { status: 500 }
        );
    }
}