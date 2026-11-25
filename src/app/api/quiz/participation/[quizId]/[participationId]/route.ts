import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';

// Uma conclusão (página do resultado). A chave de quem jogou, guardada no navegador dela,
// chega no cabeçalho x-participation-key e segue para a API, nunca no endereço.
export async function GET(request: Request, { params }: { params: Promise<{ quizId: string, participationId: string }> }) {
    try {
        const { quizId, participationId } = await params
        const cookieHeader = request.headers.get('cookie') || ''
        const ownerKey = request.headers.get('x-participation-key') || ''

        const externalApiResponse = await ApiData({
            path: `participation/${encodeURIComponent(quizId)}/${encodeURIComponent(participationId)}`,
            method: 'GET',
            headerKey: ['Cookie', 'X-Participation-Key'],
            headerValue: [cookieHeader, ownerKey],
            cache: { cache: 'no-store' }
        })

        const responseData = await externalApiResponse.json()
        return NextResponse.json(responseData, { status: externalApiResponse.ok ? 200 : externalApiResponse.status })
    } catch (error) {
        console.error('[API ROUTE /api/quiz/participation] Erro inesperado:', error)
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' },
            { status: 500 }
        )
    }
}
