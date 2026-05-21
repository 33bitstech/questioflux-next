import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';

const currencyByLocale = {
    en: 'USD',
    pt: 'BRL',
} as const;

type Locale = keyof typeof currencyByLocale;

function isValidLocale(locale: string): locale is Locale {
    return locale in currencyByLocale;
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ locale: string }> }
) {
    try {
        const cookieHeader = request.headers.get('cookie') || '';
        const { locale } = await params;

        if (!isValidLocale(locale)) {
            return NextResponse.json(
                {
                    type: 'global',
                    message: 'Invalid locale.',
                    messagePT: 'Locale inválido.',
                },
                { status: 400 }
            );
        }

        const currency = currencyByLocale[locale];

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
            },
            { status: 500 }
        );
    }
}