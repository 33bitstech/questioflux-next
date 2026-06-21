import { NextResponse } from 'next/server'
import ApiData from '@/utils/ApiData'

export async function PUT(request: Request) {
    try {
        const cookieHeader = request.headers.get('cookie') || ''
        const body = await request.json()

        const { searchParams } = new URL(request.url)
        const locale = searchParams.get('locale') || 'en'

        const externalApiResponse = await ApiData({
            path: `user?locale=${locale}`,
            method: 'PUT',
            body: JSON.stringify(body),
            headerKey: ['Content-Type', 'Cookie'],
            headerValue: ['application/json', cookieHeader],
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
        console.error('[API ROUTE /api/user/update] Erro inesperado:', error)

        return NextResponse.json(
            { type: 'global', message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' },
            { status: 500 }
        )
    }
}