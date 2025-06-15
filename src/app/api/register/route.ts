import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData'; 

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const externalApiResponse = await ApiData({
            path: 'user', 
            method: 'POST',
            body: JSON.stringify(body), 
            headerKey: 'Content-Type',
            headerValue: 'application/json',
            cache: { cache: 'no-store' },
        });

        const responseData = await externalApiResponse.json();

        if (!externalApiResponse.ok) {
            return NextResponse.json(responseData, { status: externalApiResponse.status });
        }
        
        return NextResponse.json(responseData, { status: 200 });

    } catch (error) {
        console.error('[API ROUTE /api/register] Erro inesperado:', error);
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' }, 
            { status: 500 }
        );
    }
}