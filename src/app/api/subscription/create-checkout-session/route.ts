import { NextRequest, NextResponse } from 'next/server';
import { clientSecretUsage, clientSessionAss } from '@/app/[locale]/(subsGroup)/subscription/[type]/actions';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type } = body;

        if (!type) {
            return NextResponse.json({ error: 'Tipo ausente' }, { status: 400 });
        }

        let clientSecret: string | null = null;

        switch (type) {
            case 'questioplus': {
                const { res: resAss, err: errAss } = await clientSessionAss();
                if (errAss) throw errAss;
                clientSecret = resAss.client_secret;
                break;
            }
            case 'questioplususage': {
                const { res, err } = await clientSecretUsage();
                if (err) throw err;
                clientSecret = res.client_secret;
                break;
            }
            default:
                return NextResponse.json({ error: 'Tipo de assinatura inválido' }, { status: 400 });
        }

        if (!clientSecret) throw new Error('Falha ao gerar o client secret.');

        return NextResponse.json({ clientSecret });
    } catch (err: any) {
        console.error('Erro na API:', err);
        return NextResponse.json({ error: err.message || 'Erro interno' }, { status: 500 });
    }
}