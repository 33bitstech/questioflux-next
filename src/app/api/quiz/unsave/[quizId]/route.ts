import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';

export async function DELETE(request: Request, { params }: { params: Promise<{ quizId: string }> }) {
    try {
        const cookieHeader = request.headers.get('cookie') || '';
        const { quizId } = await params;

        const externalApiResponse = await ApiData({
            path: `unsave-quiz/${quizId}`,
            method: 'DELETE',
            headerKey: 'Cookie',
            headerValue: cookieHeader,
            cache: { cache: 'no-store' },
        });

        const responseData = await externalApiResponse.json();

        if (!externalApiResponse.ok) {
            return NextResponse.json(responseData, { status: externalApiResponse.status });
        }

        const response = NextResponse.json(responseData, { status: 200 })

        const setCookies = externalApiResponse.headers.getSetCookie()

        if (setCookies && setCookies.length > 0) {
            setCookies.forEach(cookie => {
                response.headers.append('Set-Cookie', cookie)
            })
        }

        return response

    } catch (error) {
        console.error('[API ROUTE /api/quiz/unsave] Erro inesperado:', error);
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' },
            { status: 500 }
        );
    }
}