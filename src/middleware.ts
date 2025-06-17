import { NextRequest, NextResponse } from "next/server";

const publicRoutes = [
        {src: '/login', actionWhenAuth: 'redirect'},
        {src: '/register', actionWhenAuth: 'redirect'},
        {src: '/', actionWhenAuth: 'redirect'},
        {src: '/about-us', actionWhenAuth: 'next'}
    ] as {src:string, actionWhenAuth: 'next' | 'redirect'}[],
    
    defaultRoute = '/login'

export function middleware(req: NextRequest){
    const path = req.nextUrl.pathname, // seria a url dps do localhost://
        publicRoute = publicRoutes.find(route=>route.src === path),
        authToken = req.cookies.get('token')

    if(publicRoute && !authToken){// rota publica e sem login
        return NextResponse.next()
    }
    if(publicRoute && authToken && publicRoute.actionWhenAuth === 'redirect'){ //rota publica, logado e pagina de sem login
        const redirectPath = req.nextUrl.clone()
        redirectPath.pathname = '/home'
        return NextResponse.redirect(redirectPath)
    }
    if(!publicRoute && !authToken){ // rota privada e sem login
        const redirectPath = req.nextUrl.clone()
        redirectPath.pathname = defaultRoute
        return NextResponse.redirect(redirectPath)
    }
    if(!publicRoute && authToken){ // rota privada e com login
        
        // verificar se o token ta expirado, se sim eu excluiria o token e dava redirect pro login
        return NextResponse.next()
    }
    return NextResponse.next()
}

export const config = {
    matcher:[
        '/((?!api|_next/static|_next/image|icon.svg|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}