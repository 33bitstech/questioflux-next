import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';

export async function GET(request: Request, {params}: {params:{quizId:string}}) {
    try {
        const {quizId} = await params
    
    
        const externalApiResponse = await ApiData({
            path: `quiz/${quizId}`, 
            method: 'GET',
            cache: {next:{revalidate: 60 * 60}}
        })

        const responseData = await externalApiResponse.json();

        if (!externalApiResponse.ok) {
            return NextResponse.json(responseData, { status: externalApiResponse.status });
        }
        
        return NextResponse.json(responseData, { status: 200 });

    } catch (error) {
        console.error('[API ROUTE /api/quiz] Erro inesperado:', error);
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' }, 
            { status: 500 }
        );
    }
}