import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';

export async function DELETE(request: Request, {params}: {params:{quizId:string}}) {
    try {
        const Headers = request.headers,
            token = Headers.get('Authorization'),
            {quizId} = await params
    
        if (!token || !token.startsWith('Bearer ')) return NextResponse.json(
                { type: 'global', message: 'no valid token' },
                { status: 401 } 
            );

        const externalApiResponse = await ApiData({
            path: `unsave-quiz/${quizId}`, 
            method: 'DELETE',
            headerKey: 'Authorization',
            headerValue: token,
            cache: {cache: 'no-store'}
        })
        console.log(externalApiResponse)
        const responseData = await externalApiResponse.json();

        if (!externalApiResponse.ok) {
            return NextResponse.json(responseData, { status: externalApiResponse.status });
        }
        
        return NextResponse.json(responseData, { status: 200 });

    } catch (error) {
        console.error('[API ROUTE /api/quiz/unsave] Erro inesperado:', error);
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' }, 
            { status: 500 }
        );
    }
}