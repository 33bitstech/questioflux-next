import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/env'

export async function GET(request: NextRequest) {
    try {
        const sessionId = request.nextUrl.searchParams.get('session_id')

        if (!sessionId) {
            return NextResponse.json(
                { error: 'session_id ausente' },
                { status: 400 }
            )
        }

        const cookieHeader = request.headers.get('cookie') || ''

        const response = await fetch(
            `${env.NEXT_PUBLIC_DOMAIN_API}/checkout-session-status?session_id=${sessionId}`,
            {
                method: 'GET',
                headers: {
                    cookie: cookieHeader
                },
                credentials: 'include'
            }
        )

        const res = await response.json()

        if (!response.ok) {
            return NextResponse.json(res, { status: response.status })
        }

        return NextResponse.json(res)
    } catch (err: any) {
        console.error('Erro ao buscar status do checkout:', err)

        return NextResponse.json(
            { error: err.message || 'Erro interno' },
            { status: 500 }
        )
    }
}