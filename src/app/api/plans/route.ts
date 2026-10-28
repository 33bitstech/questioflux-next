import { NextResponse } from 'next/server';
import { env } from '@/env';

// Planos e preços vigentes (vêm do Stripe pelo backend). O backend guarda por 5 minutos;
// aqui fica 1 minuto, para uma troca de preço aparecer logo depois.
export async function GET() {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_API}/plans`, { next: { revalidate: 60 } })
        const data = await response.json()
        return NextResponse.json(data, { status: response.ok ? 200 : response.status })
    } catch (error) {
        console.error('[API ROUTE /api/plans] Erro inesperado:', error)
        return NextResponse.json({ type: 'global', message: 'prices are unavailable right now' }, { status: 503 })
    }
}
