'use client'

import { useEffect, useLayoutEffect } from 'react';
import { usePathname } from '@/i18n/navigation'; 

export default function ScrollToTop() {
    const pathname = usePathname(); 

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return null;
}