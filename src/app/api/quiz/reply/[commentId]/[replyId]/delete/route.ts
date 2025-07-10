import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';

export async function DELETE(request: Request, {params}: {params:Promise<{commentId:string, replyId:string}>}) {
    try {
        const Headers = request.headers,
            token = Headers.get('Authorization'),
            {commentId, replyId} = await params,
            body = await request.json()
    
        if (!token || !token.startsWith('Bearer ')) return NextResponse.json(
                { type: 'global', message: 'no valid token' },
                { status: 401 } 
            );

        const externalApiResponse = await ApiData({
            path: `reply/${commentId}/${replyId}`, 
            method: 'DELETE',
            body: JSON.stringify(body),
            headerKey: ['Authorization', 'Content-Type'],
            headerValue: [token, 'application/json'],
            cache: {cache: 'no-store'}
        })

        const responseData = await externalApiResponse.json();

        if (!externalApiResponse.ok) {
            return NextResponse.json(responseData, { status: externalApiResponse.status });
        }
        

        return NextResponse.json(responseData, { status: 200 });

    } catch (error) {
        console.error('[API ROUTE /api/quiz/reply/delete] Erro inesperado:', error);
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' }, 
            { status: 500 }
        );
    }
}