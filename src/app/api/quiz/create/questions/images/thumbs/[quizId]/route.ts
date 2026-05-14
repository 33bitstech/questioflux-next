import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';

export async function POST(request: Request, { params }: { params: Promise<{ quizId: string }> }) {
    try {
        const cookieHeader = request.headers.get('cookie') || '';
        const body = await request.formData();
        const { quizId } = await params;

        const externalApiResponse = await ApiData({
            path: `questions-thumbnail/${quizId}`,
            method: 'POST',
            body,
            headerKey: 'Cookie',
            headerValue: cookieHeader,
            cache: { cache: 'no-store' },
        });

        const responseData = await externalApiResponse.json();

        if (!externalApiResponse.ok) {
            return NextResponse.json({ data: responseData }, { status: externalApiResponse.status });
        }
        return NextResponse.json({ data: responseData }, { status: 200 });
    } catch (err: any) {
        console.error('[API ROUTE /quiz/create/questions/thumbs] Erro inesperado:', err);
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ quizId: string }> }) {
    try {
        const cookieHeader = request.headers.get('cookie') || '';
        const body = await request.formData();
        const { quizId } = await params;

        const externalApiResponse = await ApiData({
            path: `questions-thumbnail/${quizId}`,
            method: 'PUT',
            body,
            headerKey: 'Cookie',
            headerValue: cookieHeader,
            cache: { cache: 'no-store' },
        });

        const responseData = await externalApiResponse.json();

        if (!externalApiResponse.ok) {
            return NextResponse.json({ data: responseData }, { status: externalApiResponse.status });
        }
        return NextResponse.json({ data: responseData }, { status: 200 });
    } catch (err: any) {
        console.error('[API ROUTE /quiz/create/questions/thumbs] Erro inesperado:', err);
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' },
            { status: 500 }
        );
    }
}