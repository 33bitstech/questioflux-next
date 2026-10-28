import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';

// Respostas de uma tentativa do ranking, questão por questão. Vai com o cookie: o backend
// só responde para a própria pessoa ou para quem criou o quiz.
export async function GET(request: Request, {params}: {params: Promise<{quizId: string, userId: string}>}) {
    try {
        const {quizId, userId} = await params
        const cookieHeader = request.headers.get('cookie') || ''

        const externalApiResponse = await ApiData({
            path: `leaderboard/${quizId}/answers/${encodeURIComponent(userId)}`,
            method: 'GET',
            headerKey: 'Cookie',
            headerValue: cookieHeader,
            cache: {cache: 'no-store'}
        })

        const responseData = await externalApiResponse.json();
        return NextResponse.json(responseData, { status: externalApiResponse.ok ? 200 : externalApiResponse.status });
    } catch (error) {
        console.error('[API ROUTE /api/quiz/leaderboard/answers] Erro inesperado:', error);
        return NextResponse.json(
            { type: 'global', message: 'An error occurred on the server.', messagePT: 'Ocorreu um erro no servidor.', messageES: 'Ocurrió un error en el servidor.' },
            { status: 500 }
        );
    }
}
