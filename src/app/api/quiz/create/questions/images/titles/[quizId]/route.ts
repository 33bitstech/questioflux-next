import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';

export async function PUT(request: Request, { params }: { params: Promise<{ quizId: string }> }) {
    try {
        const cookieHeader = request.headers.get('cookie') || '';
        const body = await request.json();
        const { quizId } = await params;

        const externalApiResponse = await ApiData({
            path: `questions-images/${quizId}`,
            method: 'PUT',
            body: JSON.stringify(body),
            headerKey: ['Content-Type', 'Cookie'],
            headerValue: ['application/json', cookieHeader],
            cache: { cache: 'no-store' },
        });

        const responseData = await externalApiResponse.json();

        if (!externalApiResponse.ok) {
            return NextResponse.json({ data: responseData }, { status: externalApiResponse.status });
        }
        return NextResponse.json({ data: responseData }, { status: 200 });
    } catch (err: any) {
        console.error('[API ROUTE /quiz/create/questions/titles] Erro inesperado:', err);
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' },
            { status: 500 }
        );
    }
}