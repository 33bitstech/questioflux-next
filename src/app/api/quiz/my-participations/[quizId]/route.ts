import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';

// As conclusões de quem pede num quiz ("Seus convites"): pela conta (cookie) e pelas chaves
// guardadas no navegador, que vêm no corpo e seguem no corpo, nunca no endereço.
export async function POST(request: Request, { params }: { params: Promise<{ quizId: string }> }) {
    try {
        const { quizId } = await params
        const cookieHeader = request.headers.get('cookie') || ''
        const body = await request.json().catch(() => ({}))
        const keys = Array.isArray(body?.keys) ? body.keys.slice(0, 20) : []

        const externalApiResponse = await ApiData({
            path: `my-participations/${encodeURIComponent(quizId)}`,
            method: 'POST',
            body: JSON.stringify({ keys }),
            headerKey: ['Content-Type', 'Cookie'],
            headerValue: ['application/json', cookieHeader],
            cache: { cache: 'no-store' },
        })

        const responseData = await externalApiResponse.json()
        return NextResponse.json(responseData, { status: externalApiResponse.ok ? 200 : externalApiResponse.status })
    } catch (error) {
        console.error('[API ROUTE /api/quiz/my-participations] Erro inesperado:', error)
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' },
            { status: 500 }
        )
    }
}
