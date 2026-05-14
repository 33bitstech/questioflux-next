import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';

export async function POST(request: Request, { params }: { params: Promise<{ quizId: string; questionId: string }> }) {
    try {
        const cookieHeader = request.headers.get('cookie') || '';
        const body = await request.formData();
        const { quizId, questionId } = await params;

        const externalApiResponse = await ApiData({
            path: `quiz-images-alternatives/${quizId}/${questionId}`,
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
        console.error('[API ROUTE /quiz/create/questions/alternatives] Erro inesperado:', err);
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ quizId: string; questionId: string }> }) {
    try {
        const cookieHeader = request.headers.get('cookie') || '';
        const body = await request.formData();
        const { quizId, questionId } = await params;

        const externalApiResponse = await ApiData({
            path: `quiz-image-alternatives/${quizId}/${questionId}`,
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
        console.error('[API ROUTE /quiz/create/questions/alternatives] Erro inesperado:', err);
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' },
            { status: 500 }
        );
    }
}