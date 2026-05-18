import { NextResponse } from 'next/server'
import ApiData from '@/utils/ApiData'

export async function PUT(request: Request) {
    try {
        const cookieHeader = request.headers.get('cookie') || ''
        const resFormData = await request.formData()
        const imageFile = resFormData.get('profileImg')

        const file = imageFile as File

        if (!file || file.size === 0) {
            return NextResponse.json(
                { type: 'global', message: 'no valid image' },
                { status: 400 }
            )
        }

        const imageFormData = new FormData()
        imageFormData.append('profileImg', file, file.name)

        const externalApiResponse = await ApiData({
            path: 'img-profile',
            method: 'PUT',
            body: imageFormData,
            headerKey: 'Cookie',
            headerValue: cookieHeader,
            cache: { cache: 'no-store' },
        })

        const responseData = await externalApiResponse.json()

        if (!externalApiResponse.ok) {
            return NextResponse.json(responseData, { status: externalApiResponse.status })
        }

        const response = NextResponse.json(responseData, { status: 200 })

        const setCookies = externalApiResponse.headers.getSetCookie()

        if (setCookies && setCookies.length > 0) {
            setCookies.forEach(cookie => {
                response.headers.append('Set-Cookie', cookie)
            })
        }

        return response
    } catch (error) {
        console.error('[API ROUTE /api/user/update/profileImg] Erro inesperado:', error)

        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' },
            { status: 500 }
        )
    }
}