import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ quizId: string }> }
) {
    try {
        const { quizId } = await params;

        if (!quizId) {
            return NextResponse.json(
                {
                    message: 'Quiz ID is required',
                    messagePT: 'O ID do quiz é obrigatório',
                    type: 'global',
                },
                { status: 400 }
            );
        }

        const externalApiResponse = await ApiData({
            path: `recommendation/${quizId}`,
            method: 'GET',
            cache: { cache: 'no-store' },
        });

        const responseData = await externalApiResponse.json();

        if (!externalApiResponse.ok) {
            return NextResponse.json(responseData, {
                status: externalApiResponse.status,
            });
        }

        return NextResponse.json(responseData, { status: 200 });
    } catch (error) {
        console.error('[API ROUTE /api/quiz/recommendation/[quizId]] Erro inesperado:', error);

        return NextResponse.json(
            {
                message: 'An unexpected error occurred while fetching the recommendation',
                messagePT: 'Ocorreu um erro inesperado ao buscar a recomendação',
                type: 'global',
            },
            { status: 500 }
        );
    }
}