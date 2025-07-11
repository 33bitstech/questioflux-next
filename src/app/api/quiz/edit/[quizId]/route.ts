import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData'; 

export async function PUT(request: Request, {params}: {params:Promise<{quizId:string}>}) {
    try {
        const resFormData = await request.formData(),
            Headers = request.headers,
            token = Headers.get('Authorization'),

            imageFile = resFormData.get('quizImg'),
            quizFieldsString = resFormData.get('quizDatas'),
            {quizId} = await params

        if (!token || !token.startsWith('Bearer ')) return NextResponse.json(
            { type: 'global', message: 'no valid token' },
            { status: 401 } 
        );
        
        if (!quizFieldsString || typeof quizFieldsString !== 'string') return

        const externalApiResponse = await ApiData({
            path: `quiz/${quizId}`, 
            method: 'PUT',
            body: JSON.stringify(JSON.parse(quizFieldsString)), 
            headerKey: ['Content-Type', 'Authorization'],
            headerValue: ['application/json', token],
            cache: { cache: 'no-store' },
        });
        const responseData = await externalApiResponse.json();

        if (!externalApiResponse.ok) return NextResponse.json(responseData, { status: externalApiResponse.status });

        const file = imageFile as File
        if (!file || file.size === 0) return NextResponse.json({data:responseData}, { status: 200 })

        const imageFormData = new FormData()

        imageFormData.append('quizImg', file, file.name)
        
        const externalApiResponseImage = await ApiData({
            path: `quiz-thumbnail/${responseData.quizId}`, 
            method: 'PUT',
            body: imageFormData, 
            headerKey: 'Authorization',
            headerValue: token,
            cache: { cache: 'no-store' },
        });

        const resImage = await externalApiResponseImage.json()

        if(!externalApiResponseImage.ok){
            return NextResponse.json({data:responseData, errImage:resImage}, { status:200});
        }
        
        return NextResponse.json({data:responseData}, { status: 200 });

    } catch (err:any) {
        console.error('[API ROUTE /quiz] Erro inesperado:', err);
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' }, 
            { status: 500 }
        );
    } 
}