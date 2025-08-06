'use client'
import { useState } from 'react';

type TPopup = 'register' | 'login' | "guest"
interface UsePopupAuthReturn {
    typePopup: TPopup
    toLogin: () => void;
    toRegister: () => void;
    toGuest: () => void
}

const usePopupAuth = (): UsePopupAuthReturn => {
    const [typePopup, setTypePopup] = useState<TPopup>('register')
    
    const toLogin = (): void => {
        setTypePopup('login');
    };
    const toRegister = (): void => {
        setTypePopup('register');
    };
    const toGuest = (): void=>{
        setTypePopup('guest')
    }
    return { toLogin, toRegister, typePopup, toGuest};
};

export default usePopupAuth;