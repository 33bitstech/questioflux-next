'use client'

import {getCookie, setCookie, deleteCookie, OptionsType} from 'cookies-next/client';
type CookieValue = any;

interface UseCustomCookiesReturn {
    cookie: CookieValue;
    createCookie: (cookieValue: CookieValue) => void;
    removeCookie: () => void;
    setToken: (token: string) => void;
}

const useCustomCookies = (cookieName: string): UseCustomCookiesReturn => {
    const cookieOptions: OptionsType = {
        path: '/',
        domain: '.quizvortex.site',
        maxAge: 60 * 60 * 24 * 7, // 7 dias
        secure: true,
        sameSite: 'strict'
    };

    const createCookie = (cookieValue: CookieValue): void => {
        setCookie(cookieName, cookieValue, cookieOptions);
    };

    const removeCookie = (): void => {
        deleteCookie(cookieName, { path: '/', domain: '.quizvortex.site' });
    };

    const setToken = (token: string): void => {
        setCookie(cookieName, `Bearer ${token}`, cookieOptions);
    };

    const cookie = getCookie(cookieName, cookieOptions)

    return { cookie, createCookie, removeCookie, setToken };
};

export default useCustomCookies;