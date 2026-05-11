import { NextRequest, NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl
        const page = searchParams.get('page') || '1'

        const externalApiResponse = await ApiData({
            path: `v2/public-quizzes?page=${page}`,
            method: 'GET',
            cache: { cache: 'no-store' },
        });

        const responseData = await externalApiResponse.json();

        if (!externalApiResponse.ok) {
            return NextResponse.json(responseData, { status: externalApiResponse.status });
        }

        return NextResponse.json(responseData, { status: 200 });

    } catch (error) {
        console.error('[API ROUTE /api/quizzes/public] Erro inesperado:', error);
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' },
            { status: 500 }
        );
    }
}