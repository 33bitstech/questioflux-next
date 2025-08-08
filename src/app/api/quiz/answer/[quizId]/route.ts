import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';

export async function POST(request: Request, {params}: {params:Promise<{quizId:string}>}) {
    try {
        const {quizId} = await params,
            body = await request.json()
    
        const Headers = request.headers,
            token = Headers.get('Authorization')

        const externalApiResponse = await ApiData({
            path: `answer-quiz/${quizId}`, 
            method: 'POST',
            body: JSON.stringify(body),
            headerKey: ['Content-Type', 'Authorization'],
            headerValue: ['application/json', token || ''],
            cache: {cache: 'no-store'}
        })

        const responseData = await externalApiResponse.json();

        if (!externalApiResponse.ok) {
            return NextResponse.json(responseData, { status: externalApiResponse.status });
        }
        

        return NextResponse.json(responseData, { status: 200 });

    } catch (error) {
        console.error('[API ROUTE /api/quiz/answer] Erro inesperado:', error);
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' }, 
            { status: 500 }
        );
    }
}