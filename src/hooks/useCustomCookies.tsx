'use client'

import {getCookie, setCookie, deleteCookie, OptionsType, CookieValueTypes} from 'cookies-next/client';
import { useCallback, useState } from 'react';
type CookieValue = string | undefined;

interface UseCustomCookiesReturn {
    cookie: CookieValue,
    createCookie: (cookieValue: CookieValue) => void,
    removeCookie: () => void,
    setToken: (token: string) => void,
    refreshCookie: () => void
}

const useCustomCookies = (cookieName: string): UseCustomCookiesReturn => {
    
    const cookieOptions: OptionsType = {
        path: '/',
        //domain: '.quizvortex.site',
        maxAge: 60 * 60 * 24 * 7, // 7 dias
        /*         secure: true,
        sameSite: 'strict' */
    };

    const [cookie, setInternalCookie] = useState<CookieValue>(() => getCookie(cookieName, cookieOptions))
    
    const createCookie = useCallback((cookieValue: CookieValue): void => {
        setCookie(cookieName, cookieValue, cookieOptions);
        setInternalCookie(cookieValue)
    }, []);

    const removeCookie = useCallback((): void => {
        deleteCookie(cookieName, { path: '/'/* , domain: '.quizvortex.site'  */});
        setInternalCookie(undefined)
    }, [])

    const setToken = useCallback((token: string): void => {
        setCookie(cookieName, `Bearer ${token}`, cookieOptions);
        setInternalCookie(`Bearer ${token}`)
    }, [])

    const refreshCookie = useCallback(() => {
        const newCookieValue = getCookie(cookieName);
        setInternalCookie(newCookieValue);
    }, [cookieName])


    return { cookie, createCookie, removeCookie, setToken, refreshCookie};
};

export default useCustomCookies;