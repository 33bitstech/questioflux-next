import { NextRequest, NextResponse } from "next/server";
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

type PublicRoute = {
    src: string | RegExp;
    actionWhenAuth: 'next' | 'redirect';
};

const publicRoutes: PublicRoute[] = [    
    { src: /^\/(en|pt)$/, actionWhenAuth: 'redirect' },
    { src: /^\/(en|pt)\/login$/, actionWhenAuth: 'redirect' },
    { src: /^\/(en|pt)\/register$/, actionWhenAuth: 'redirect' },
    { src: /^\/(en|pt)\/about-us$/, actionWhenAuth: 'next' },
    { src: /^\/(en|pt)\/rescuepassword$/, actionWhenAuth: 'redirect' },
    { src: /^\/(en|pt)\/login\/recovery\/[^/]+$/, actionWhenAuth: 'next' },
    { src: /^\/(en|pt)\/explore$/, actionWhenAuth: 'next' },
    { src: /^\/(en|pt)\/create\/quiz\/cover$/, actionWhenAuth: 'next' },
    { src: /^\/(en|pt)\/quiz\/[^/]+$/, actionWhenAuth: 'next' },
    { src: /^\/(en|pt)\/quiz\/.+\/taking$/, actionWhenAuth: 'next' },
    { src: /^\/(en|pt)\/quiz\/.+\/comments$/, actionWhenAuth: 'next' },
    { src: /^\/(en|pt)\/quiz\/.+\/leaderboard$/, actionWhenAuth: 'next' },
]

export function middleware(req: NextRequest) {
    let path = req.nextUrl.pathname; 
    const authToken = req.cookies.get('token');
    const requestHeaders = new Headers(req.headers)
    const locale = path.split('/')[1] == 'en' || path.split('/')[1] == 'pt' ? path.split('/')[0] : 'en'

    const defaultPrivateRoute = `/${locale}/home`; 
    const defaultPublicRoute = `/${locale}/login`;

    if(path == '/' || path == '') path = `/${locale}`

    requestHeaders.set('x-pathname', path)

    const publicRoute = publicRoutes.find(route => {
        if (route.src instanceof RegExp) {
            return route.src.test(path);
        }
        return route.src === path;
    });

    if(path == `/${locale}` && !authToken){
        const url = req.nextUrl.clone()
        url.pathname = path
        return NextResponse.rewrite(url);
    }

    // 1. Rota pública e usuário NÃO está logado
    // Ação: Permite o acesso
    if (publicRoute && !authToken) {
        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        })
    }

    // 2. Rota pública, usuário ESTÁ logado e a ação é 'redirect'
    // Ação: Redireciona para a página principal do usuário logado (ex: /home)
    if (publicRoute && authToken && publicRoute.actionWhenAuth === 'redirect') {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = defaultPrivateRoute;
        return NextResponse.redirect(redirectUrl);
    }

    // 3. Rota privada e usuário NÃO está logado
    // Ação: Redireciona para a página de login
    if (!publicRoute && !authToken) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = defaultPublicRoute;
        return NextResponse.redirect(redirectUrl);
    }
    
    // Para os casos restantes:
    // - Rota pública, logado e actionWhenAuth: 'next' -> Permite acesso
    // - Rota privada e logado -> Permite acesso (aqui você pode adicionar a verificação de expiração do token)
    // - etc.
    // Ação: Permite o acesso
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })
}

export const config = {
    matcher: [

        '/((?!api|_next/static|_next/image|icon.svg|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};