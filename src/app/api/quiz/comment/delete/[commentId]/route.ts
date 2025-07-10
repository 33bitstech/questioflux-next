import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';

export async function DELETE(request: Request, {params}: {params:Promise<{commentId:string}>}) {
    try {
        const Headers = request.headers,
            token = Headers.get('Authorization'),
            {commentId} = await params,
            body = await request.json()
    
        if (!token || !token.startsWith('Bearer ')) return NextResponse.json(
                { type: 'global', message: 'no valid token' },
                { status: 401 } 
            );

        const externalApiResponse = await ApiData({
            path: `comment/${commentId}`, 
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
        console.error('[API ROUTE /api/quiz/comment/delete] Erro inesperado:', error);
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' }, 
            { status: 500 }
        );
    }
}