import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';

export async function GET(request: Request, {params}: {params:Promise<{quizId:string}>}) {
    try {
        const {quizId} = await params
        const cookieHeader = request.headers.get('cookie') || ''

        // o ranking muda conforme quem pede (a própria entrada oculta, as próprias respostas)
        const externalApiResponse = await ApiData({
            path: `leaderboard/${quizId}`,
            method: 'GET',
            headerKey: 'Cookie',
            headerValue: cookieHeader,
            cache: {cache: 'no-store'}
        })

        const responseData = await externalApiResponse.json();

        if (!externalApiResponse.ok) {
            return NextResponse.json(responseData, { status: externalApiResponse.status });
        }
        
        return NextResponse.json(responseData, { status: 200 });

    } catch (error) {
        console.error('[API ROUTE /api/quiz/leaderboard] Erro inesperado:', error);
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' }, 
            { status: 500 }
        );
    }
}