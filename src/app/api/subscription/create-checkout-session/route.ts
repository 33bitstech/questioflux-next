// app/api/create-checkout-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
// Certifique-se de que o caminho para suas actions está correto
import { clientSecretUsage, clientSessionAss } from '@/app/[locale]/(subsGroup)/subscription/[type]/actions';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, token } = body;

        if (!type || !token) {
            return NextResponse.json({ error: 'Tipo ou token ausentes' }, { status: 400 });
        }

        let clientSecret: string | null = null;

        // A lógica foi movida do seu componente de servidor para esta rota de API.
        switch (type) {
            case 'vortexplus':
                const { res: resAss, err: errAss } = await clientSessionAss(token);
                if (errAss) throw errAss;
                clientSecret = resAss.client_secret;
                break;
            case 'vortexplususage':
                const { res, err } = await clientSecretUsage(token);
                if (err) throw err;
                clientSecret = res.client_secret;
                break;
            default:
                return NextResponse.json({ error: 'Tipo de assinatura inválido' }, { status: 400 });
        }

        if (!clientSecret) {
            throw new Error('Falha ao gerar o client secret.');
        }

        // A resposta deve ser um objeto JSON com a chave `clientSecret`.
        return NextResponse.json({ clientSecret: clientSecret });

    } catch (err: any) {
        console.error('Erro na API:', err);
        return NextResponse.json({ error: err.message || 'Ocorreu um erro interno no servidor' }, { status: 500 });
    }
}
