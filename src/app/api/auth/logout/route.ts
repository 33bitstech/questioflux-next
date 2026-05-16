import { NextResponse } from 'next/server';
import ApiData from '@/utils/ApiData';

export async function POST(request: Request) {
    try {
        const cookieHeader = request.headers.get('cookie') || '';
        await ApiData({
            path: 'logout',
            method: 'POST',
            headerKey: 'Cookie',
            headerValue: cookieHeader,
            cache: { cache: 'no-store' },
        });
    } catch (error) {
        console.error('[logout] erro ao chamar backend:', error);
    }

    const host = request.headers.get('host') || '';
    const hostWithoutPort = host.split(':')[0];
    const parts = hostWithoutPort.split('.');
    const rootDomain = parts.length >= 2
        ? '.' + parts.slice(-2).join('.')
        : hostWithoutPort;

    const response = NextResponse.json({ ok: true }, { status: 200 });

    response.headers.append('Set-Cookie', `logged_in=; Path=/; Max-Age=0; SameSite=Lax`);

    response.headers.append(
        'Set-Cookie',
        `fghdhdhd=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax; Domain=${rootDomain}`
    );

    return response;
}