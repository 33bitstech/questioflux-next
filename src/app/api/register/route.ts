import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData'; 

export async function POST(request: Request) {
    try {
        const resFormData = await request.formData(),

            imageFile = resFormData.get('image'),
            registerFieldsString = resFormData.get('register')

        if (!registerFieldsString || typeof registerFieldsString !== 'string') return

        const externalApiResponse = await ApiData({
            path: 'user', 
            method: 'POST',
            body: JSON.stringify(JSON.parse(registerFieldsString)), 
            headerKey: 'Content-Type',
            headerValue: 'application/json',
            cache: { cache: 'no-store' },
        });

        const responseData = await externalApiResponse.json();

        if (!externalApiResponse.ok) return NextResponse.json(responseData, { status: externalApiResponse.status });

        const file = imageFile as File
        if (!file || file.size === 0) return NextResponse.json(responseData, { status: 200 })

        const imageFormData = new FormData()

        imageFormData.append('profileImg', file, file.name)
        
        const externalApiResponseImage = await ApiData({
            path: 'img-profile', 
            method: 'POST',
            body: imageFormData, 
            headerKey: 'Authorization',
            headerValue: `Bearer ${responseData.token}`,
            cache: { cache: 'no-store' },
        });
        const resImage = await externalApiResponseImage.json()

        if(!externalApiResponseImage.ok){
            return NextResponse.json({res:responseData, errImage:resImage}, { status:200});
        }
        
        return NextResponse.json(resImage, { status: 200 });

    } catch (err:any) {
        console.error('[API ROUTE /api/register] Erro inesperado:', err);

        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' }, 
            { status: 500 }
        );
    } 
}