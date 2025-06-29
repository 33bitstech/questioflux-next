import { NextRequest, NextResponse } from "next/server";

type PublicRoute = {
    src: string | RegExp;
    actionWhenAuth: 'next' | 'redirect';
};

const publicRoutes: PublicRoute[] = [
    { src: '/', actionWhenAuth: 'redirect' },
    { src: '/login', actionWhenAuth: 'redirect' },
    { src: '/register', actionWhenAuth: 'redirect' },
    { src: '/about-us', actionWhenAuth: 'next' },
    { src: '/rescuepassword', actionWhenAuth: 'redirect' },
    { src: /^\/login\/recovery\/[^/]+$/, actionWhenAuth: 'next' }, 
    { src: '/explore', actionWhenAuth: 'next' },
    { src: '/create/quiz/cover', actionWhenAuth: 'next' },
]
    
const defaultPrivateRoute = '/home'; 
const defaultPublicRoute = '/login';

export function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname; 
    const authToken = req.cookies.get('token');

    const publicRoute = publicRoutes.find(route => {
        if (route.src instanceof RegExp) {
            return route.src.test(path);
        }
        return route.src === path;
    });

    // 1. Rota pública e usuário NÃO está logado
    // Ação: Permite o acesso
    if (publicRoute && !authToken) {
        return NextResponse.next();
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
    return NextResponse.next();
}

export const config = {
    matcher: [

        '/((?!api|_next/static|_next/image|icon.svg|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};