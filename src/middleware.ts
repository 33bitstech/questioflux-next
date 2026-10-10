import { NextRequest, NextResponse } from "next/server";
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { env } from "./env";

export default createMiddleware(routing);

type PublicRoute = {
    src: string | RegExp;
    actionWhenAuth: 'next' | 'redirect';
};

const publicRoutes: PublicRoute[] = [
    { src: /^\/(en|pt|es)$/, actionWhenAuth: 'redirect' },
    { src: /^\/(en|pt|es)\/login$/, actionWhenAuth: 'redirect' },
    { src: /^\/(en|pt|es)\/register$/, actionWhenAuth: 'redirect' },
    { src: /^\/(en|pt|es)\/about-us$/, actionWhenAuth: 'next' },
    { src: /^\/(en|pt|es)\/rescuepassword$/, actionWhenAuth: 'redirect' },
    { src: /^\/(en|pt|es)\/login\/recovery\/[^/]+$/, actionWhenAuth: 'next' },
    { src: /^\/(en|pt|es)\/user\/[^/]+$/, actionWhenAuth: 'next' },
    { src: /^\/(en|pt|es)\/explore$/, actionWhenAuth: 'next' },
    { src: /^\/(en|pt|es)\/create\/quiz$/, actionWhenAuth: 'next' },
    { src: /^\/(en|pt|es)\/create\/quiz\/cover$/, actionWhenAuth: 'next' },
    { src: /^\/(en|pt|es)\/quiz\/[^/]+$/, actionWhenAuth: 'next' },
    { src: /^\/(en|pt|es)\/quiz\/.+\/taking$/, actionWhenAuth: 'next' },
    { src: /^\/(en|pt|es)\/quiz\/.+\/comments$/, actionWhenAuth: 'next' },
    { src: /^\/(en|pt|es)\/quiz\/.+\/leaderboard$/, actionWhenAuth: 'next' },
    { src: /^\/(en|pt|es)\/quiz\/.+\/results$/, actionWhenAuth: 'next' },
    { src: /^\/(en|pt|es)\/quiz\/.+\/lb$/, actionWhenAuth: 'next' },
    { src: /^\/(en|pt|es)\/embed\/quiz\/[^/]+$/, actionWhenAuth: 'next' },
];

// Rotas que exigem login. O que não é público nem protegido não existe: segue para o
// roteador responder 404 (mandar para o login fazia o Google ver um "soft 404").
const protectedRoutes: RegExp[] = [
    /^\/(en|pt|es)\/home$/,
    /^\/(en|pt|es)\/(profile|saves|drafts|create|subscription|email-confirm|email-verification)(\/.*)?$/,
    /^\/(en|pt|es)\/quiz\/edit(\/.*)?$/,
    // erros do login com Google chegam do backend em /error?code=...&msgEN=...
    /^\/(en|pt|es)\/error$/,
];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const locales = ['en', 'pt', 'es'];

    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (!pathnameHasLocale) {
        const url = req.nextUrl.clone();
        url.pathname = `/en${pathname}`;
        return NextResponse.redirect(url, { status: 308 });
    }

    // Agora verificamos o cookie 'logged_in' ao invés do token Bearer
    const isLoggedIn = req.cookies.get('logged_in');
    const requestHeaders = new Headers(req.headers)
    const locale = pathname.split('/')[1]

    const defaultPrivateRoute = `/${locale}/home`;
    const defaultPublicRoute = `/${locale}/login`;

    requestHeaders.set('x-pathname', pathname)

    const isHome = pathname === `/${locale}/home`
    
    if (isHome) {
        if (!isLoggedIn){
            const responseJson = await fetch(`${env.NEXT_PUBLIC_DOMAIN_API}/authenticate-user`, {
                headers: {
                    cookie: req.headers.get('cookie') ?? '',
                },
                method: "get"
            })

            if (!responseJson.ok) return NextResponse.redirect(new URL(defaultPublicRoute, req.url))

            const response = NextResponse.next({ request: { headers: requestHeaders } });
            const setCookies = responseJson.headers.getSetCookie();
            setCookies.forEach(cookie => {
                response.headers.append('Set-Cookie', cookie);
            });
            response.headers.append(
                'Set-Cookie',
                'logged_in=true; Path=/; SameSite=Lax; Max-Age=604800'
            );
            return response
        }
    }


    const publicRoute = publicRoutes.find(route => {
        if (route.src instanceof RegExp) return route.src.test(pathname);
        return route.src === pathname;
    });

    if (pathname == `/${locale}` && !isLoggedIn) {
        const url = req.nextUrl.clone()
        url.pathname = pathname
        return NextResponse.rewrite(url);
    }

    if (publicRoute && !isLoggedIn) {
        return NextResponse.next({ request: { headers: requestHeaders } })
    }

    if (publicRoute && isLoggedIn && publicRoute.actionWhenAuth === 'redirect') {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = defaultPrivateRoute;
        return NextResponse.redirect(redirectUrl);
    }

    const isProtectedRoute = protectedRoutes.some(route => route.test(pathname));

    if (!publicRoute && !isLoggedIn && isProtectedRoute) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = defaultPublicRoute;
        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|icon.svg|favicon.ico|iconv2.png|favicon.png|site-icon.svg|site-icon-dark.svg|trofeu.png|sitemap.xml|robots.txt|ads.txt|quiz_padrao_.+\.png).*)',
    ],
};