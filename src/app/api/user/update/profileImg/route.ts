import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';

export async function PUT(request: Request) {
    try {
        const Headers = request.headers,
            token = Headers.get('Authorization'),
            resFormData = await request.formData(),
            imageFile = resFormData.get('profileImg')
            
        if (!token || !token.startsWith('Bearer ')) return NextResponse.json(
            { type: 'global', message: 'no valid token' },
            { status: 401 } 
        )
        const file = imageFile as File;
        if (!file || file.size === 0) return NextResponse.json(
            { type: 'global', message: 'no valid image' },
            { status: 401 }
        )
        
        const imageFormData = new FormData()

        imageFormData.append('profileImg', file, file.name)

        const externalApiResponse = await ApiData({
            path: `img-profile`, 
            method: 'PUT',
            body: imageFormData,
            headerKey: ['Authorization'],
            headerValue: [token],
            cache: {cache: 'no-store'}
        })

        const responseData = await externalApiResponse.json();

        if (!externalApiResponse.ok) {
            return NextResponse.json(responseData, { status: externalApiResponse.status });
        }
        

        return NextResponse.json(responseData, { status: 200 });

    } catch (error) {
        console.error('[API ROUTE /api/user/update/profileImg] Erro inesperado:', error);
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' }, 
            { status: 500 }
        );
    }
}