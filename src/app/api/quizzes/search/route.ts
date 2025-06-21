import { NextRequest, NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData'; 
import { z } from 'zod';

export async function GET(request: NextRequest) {
    try {
        const {searchParams} = request.nextUrl
        
        const externalApiResponse = await ApiData({
            path: `search-quiz?${searchParams.toString()}`, 
            method: 'GET',
            cache: { cache: 'no-store' },
        });

        const responseData = await externalApiResponse.json();

        if (!externalApiResponse.ok) {
            return NextResponse.json(responseData, { status: externalApiResponse.status });
        }
        return NextResponse.json(responseData, { status: 200 });

    } catch (error) {
        console.error('[API ROUTE /api/quizzes/search] Erro inesperado:', error);
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' }, 
            { status: 500 }
        );
    }
}