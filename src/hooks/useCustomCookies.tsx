import { useCookies } from "react-cookie";
import { CookieSetOptions } from "universal-cookie";

type CookieValue = any;

interface UseCustomCookiesReturn {
    cookie: CookieValue;
    createCookie: (cookieValue: CookieValue) => void;
    deleteCookie: () => void;
    setToken: (token: string) => void;
}

const useCustomCookies = (cookieName: string): UseCustomCookiesReturn => {
    const [cookies, setCookie, removeCookie] = useCookies([cookieName]);
    const cookie: CookieValue = cookies[cookieName];

    const cookieOptions: CookieSetOptions = {
        path: '/',
        domain: '.quizvortex.site',
        expires: new Date(Date.now() + 7 * 86400000), // 7 dias
        secure: true,
        sameSite: 'strict'
    };

    const createCookie = (cookieValue: CookieValue): void => {
        setCookie(cookieName, cookieValue, cookieOptions);
    };

    const deleteCookie = (): void => {
        removeCookie(cookieName, { path: '/', domain: '.quizvortex.site' });
    };

    const setToken = (token: string): void => {
        setCookie(cookieName, `Bearer ${token}`, cookieOptions);
    };

    return { cookie, createCookie, deleteCookie, setToken };
};

export default useCustomCookies;