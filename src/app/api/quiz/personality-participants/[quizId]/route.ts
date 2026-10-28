import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';

// Participantes visíveis de um quiz de personalidade (paginado). Vai com o cookie: quem
// ocultou a atividade continua vendo a própria participação.
export async function GET(request: Request, {params}: {params:Promise<{quizId:string}>}) {
    try {
        const {quizId} = await params
        const page = Number(new URL(request.url).searchParams.get('page')) || 1
        const cookieHeader = request.headers.get('cookie') || ''

        const externalApiResponse = await ApiData({
            path: `personality-participants/${quizId}?page=${page}`,
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
        console.error('[API ROUTE /api/quiz/personality-participants] Erro inesperado:', error);
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' },
            { status: 500 }
        );
    }
}
