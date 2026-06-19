import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';
import { normalizeCurrency, currencyToApiParam } from '@/utils/currency';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ locale: string }> }
) {
    try {
        const cookieHeader = request.headers.get('cookie') || '';
        const { locale } = await params;
        const body = await request.json().catch(() => ({}))

        const currency = currencyToApiParam(normalizeCurrency(body?.currency, locale))

        const externalApiResponse = await ApiData({
            path: `create-stripe-subscription-session/${currency}`,
            method: 'POST',
            headerKey: 'Cookie',
            headerValue: cookieHeader,
            cache: { cache: 'no-store' },
        });

        const responseData = await externalApiResponse.json();

        if (!externalApiResponse.ok) {
            return NextResponse.json(responseData, {
                status: externalApiResponse.status,
            });
        }

        return NextResponse.json(responseData, { status: 200 });
    } catch (error) {
        console.error('[API ROUTE /api/subscription/[locale]/client-session] Erro inesperado:', error);

        return NextResponse.json(
            {
                type: 'global',
                message: 'An error occurred on the server. Please try again later.',
                messagePT: 'Ocorreu um erro no servidor. Tente novamente mais tarde.',
                messageES: 'Ocurrió un error en el servidor. Inténtalo de nuevo más tarde.',
            },
            { status: 500 }
        );
    }
}