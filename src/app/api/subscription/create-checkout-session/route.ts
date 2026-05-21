import { NextRequest, NextResponse } from 'next/server'
import {
    clientSecretUsage,
    clientSessionAss
} from '@/app/[locale]/(subsGroup)/subscription/[type]/actions'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { type, locale} = body
        console.log(locale)

        if (!type) {
            return NextResponse.json({ error: 'Tipo ausente' }, { status: 400 })
        }

        let clientSecret: string | null = null
        let sessionId: string | null = null

        switch (type) {
            case 'questioplus': {
                const { res, err } = await clientSessionAss(locale)

                if (err) throw err

                clientSecret = res.client_secret
                sessionId = res.id

                break
            }

            case 'questioplususage': {
                const { res, err } = await clientSecretUsage(locale)

                if (err) throw err

                clientSecret = res.client_secret
                sessionId = res.id

                break
            }

            default:
                return NextResponse.json(
                    { error: 'Tipo de assinatura inválido' },
                    { status: 400 }
                )
        }

        if (!clientSecret || !sessionId) {
            throw new Error('Falha ao gerar a sessão do Stripe.')
        }

        return NextResponse.json({
            clientSecret,
            id: sessionId
        })
    } catch (err: any) {
        console.error('Erro na API:', err)

        return NextResponse.json(
            { error: err.message || 'Erro interno' },
            { status: 500 }
        )
    }
}