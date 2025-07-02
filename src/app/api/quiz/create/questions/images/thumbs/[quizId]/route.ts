import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData'; 

export async function POST(request: Request, {params}: {params:{quizId:string}}) {
    try {
        const body = await request.formData(),
            Headers = request.headers,
            token = Headers.get('Authorization'),
            {quizId} = await params


        if (!token || !token.startsWith('Bearer ')) return NextResponse.json(
            { type: 'global', message: 'no valid token' },
            { status: 401 } 
        );
        
        const externalApiResponse = await ApiData({
            path: `questions-thumbnail/${quizId}`, 
            method: 'POST',
            body: body, 
            headerKey: [ 'Authorization'],
            headerValue: [token],
            cache: { cache: 'no-store' },
        });
        console.log(externalApiResponse)
        const responseData = await externalApiResponse.json();

        if (!externalApiResponse.ok) return NextResponse.json({data:responseData}, { status: externalApiResponse.status });
        
        return NextResponse.json({data:responseData}, { status: 200 });

    } catch (err:any) {
        console.error('[API ROUTE /quiz/create/questions] Erro inesperado:', err);
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' }, 
            { status: 500 }
        );
    } 
}

export async function PUT(request: Request, {params}: {params:{quizId:string}}) {
    try {
        const body = await request.formData(),
            Headers = request.headers,
            token = Headers.get('Authorization'),
            {quizId} = await params


        if (!token || !token.startsWith('Bearer ')) return NextResponse.json(
            { type: 'global', message: 'no valid token' },
            { status: 401 } 
        );
        
        const externalApiResponse = await ApiData({
            path: `questions-thumbnail/${quizId}`, 
            method: 'PUT',
            body: body, 
            headerKey: [ 'Authorization'],
            headerValue: [token],
            cache: { cache: 'no-store' },
        });
        console.log(externalApiResponse)
        const responseData = await externalApiResponse.json();

        if (!externalApiResponse.ok) return NextResponse.json({data:responseData}, { status: externalApiResponse.status });
        
        return NextResponse.json({data:responseData}, { status: 200 });

    } catch (err:any) {
        console.error('[API ROUTE /quiz/create/questions] Erro inesperado:', err);
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' }, 
            { status: 500 }
        );
    } 
}