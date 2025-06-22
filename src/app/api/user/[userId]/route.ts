import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';

export async function GET(request: Request, {params}: {params:{userId:string}}) {
    try {
        const {userId} = await params
    
    
        const externalApiResponse = await ApiData({
            path: `user/${userId}`, 
            method: 'GET',
            cache: {next:{revalidate: 60 * 60}}
        })

        const responseData = await externalApiResponse.json();

        if (!externalApiResponse.ok) {
            return NextResponse.json(responseData, { status: externalApiResponse.status });
        }
        
        return NextResponse.json(responseData, { status: 200 });

    } catch (error) {
        console.error('[API ROUTE /api/user/userId] Erro inesperado:', error);
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' }, 
            { status: 500 }
        );
    }
}