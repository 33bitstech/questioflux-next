import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';

export async function POST(request: Request, { params }: { params: Promise<{ commentId: string }> }) {
    try {
        const cookieHeader = request.headers.get('cookie') || '';
        const { commentId } = await params;
        const body = await request.json();

        const externalApiResponse = await ApiData({
            path: `reply/${commentId}`,
            method: 'POST',
            body: JSON.stringify(body),
            headerKey: ['Content-Type', 'Cookie'],
            headerValue: ['application/json', cookieHeader],
            cache: { cache: 'no-store' },
        });

        const responseData = await externalApiResponse.json();

        if (!externalApiResponse.ok) {
            return NextResponse.json(responseData, { status: externalApiResponse.status });
        }
        return NextResponse.json(responseData, { status: 200 });
    } catch (error) {
        console.error('[API ROUTE /api/quiz/reply] Erro inesperado:', error);
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request, { params }: { params: Promise<{ commentId: string }> }) {
    try {
        const { commentId } = await params;

        const externalApiResponse = await ApiData({
            path: `replies/${commentId}`,
            method: 'GET',
            cache: { cache: 'no-store' },
        });

        const responseData = await externalApiResponse.json();

        if (!externalApiResponse.ok) {
            return NextResponse.json(responseData, { status: externalApiResponse.status });
        }
        return NextResponse.json(responseData, { status: 200 });
    } catch (error) {
        console.error('[API ROUTE /api/quiz/reply] Erro inesperado:', error);
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' },
            { status: 500 }
        );
    }
}