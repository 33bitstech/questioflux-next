import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';

export async function DELETE(request: Request, { params }: { params: Promise<{ commentId: string; replyId: string }> }) {
    try {
        const cookieHeader = request.headers.get('cookie') || '';
        const { commentId, replyId } = await params;

        const externalApiResponse = await ApiData({
            path: `unlike-reply/${commentId}/${replyId}`,
            method: 'DELETE',
            headerKey: 'Cookie',
            headerValue: cookieHeader,
            cache: { cache: 'no-store' },
        });

        const responseData = await externalApiResponse.json();

        if (!externalApiResponse.ok) {
            return NextResponse.json(responseData, { status: externalApiResponse.status });
        }
        return NextResponse.json(responseData, { status: 200 });
    } catch (error) {
        console.error('[API ROUTE /api/quiz/reply/dislike] Erro inesperado:', error);
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' },
            { status: 500 }
        );
    }
}