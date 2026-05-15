import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';

export async function POST(request: Request) {
    try {
        const resFormData = await request.formData();
        const cookieHeader = request.headers.get('cookie') || '';
        const imageFile = resFormData.get('image');
        const registerFieldsString = resFormData.get('register');

        if (!registerFieldsString || typeof registerFieldsString !== 'string') return;

        const externalApiResponse = await ApiData({
            path: 'user',
            method: 'POST',
            body: JSON.stringify(JSON.parse(registerFieldsString)),
            headerKey: ['Content-Type', 'Cookie'],
            headerValue: ['application/json', cookieHeader],
            cache: { cache: 'no-store' },
        });

        const responseData = await externalApiResponse.json();

        if (!externalApiResponse.ok) {
            return NextResponse.json(responseData, { status: externalApiResponse.status });
        }

        const setCookies = externalApiResponse.headers.getSetCookie();

        const file = imageFile as File;
        if (!file || file.size === 0) {
            const response = NextResponse.json(responseData, { status: 200 });

            setCookies.forEach(cookie => response.headers.append('Set-Cookie', cookie));
            response.headers.append('Set-Cookie', 'logged_in=true; Path=/; SameSite=Lax; Max-Age=604800');

            return response;
        }

        const imageFormData = new FormData();
        imageFormData.append('profileImg', file, file.name);

        const cookieValues = setCookies
            .map(cookie => cookie.split(';')[0])
            .join('; ');

        const externalApiResponseImage = await ApiData({
            path: 'img-profile',
            method: 'POST',
            body: imageFormData,
            headerKey: 'Cookie',
            headerValue: cookieValues || cookieHeader,
            cache: { cache: 'no-store' },
        });

        const resImage = await externalApiResponseImage.json();

        const finalResponse = NextResponse.json(
            externalApiResponseImage.ok
                ? resImage
                : { res: responseData, errImage: resImage },
            { status: 200 }
        );

        setCookies.forEach(cookie => finalResponse.headers.append('Set-Cookie', cookie));
        finalResponse.headers.append('Set-Cookie', 'logged_in=true; Path=/; SameSite=Lax; Max-Age=604800');

        return finalResponse;

    } catch (err: any) {
        console.error('[API ROUTE /api/register] Erro inesperado:', err);
        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' },
            { status: 500 }
        );
    }
}