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

    const response = NextResponse.json({ ok: true }, { status: 200 });

    for (const name of ['fghdhdhd', 'logged_in']) {
        response.headers.append(
            'Set-Cookie',
            `${name}=; Path=/; Max-Age=0; SameSite=Lax`
        );
        response.headers.append(
            'Set-Cookie',
            `${name}=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly`
        );
    }

    return response;
}