'use client'

import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { ChangeEvent } from 'react';

export default function LangsWidget() {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale(); // Hook da next-intl para pegar o idioma ativo

    const handleLanguageChange = (newLocale: string) => {
        // A mágica acontece aqui: `router.replace` troca o idioma
        // no pathname, mantendo o resto da URL.
        // Ex: de '/pt/about-us' para '/en/about-us'
        router.replace(pathname, { locale: newLocale });
    }

    return (
        <li id='langs'>
            {/* O botão ativo é definido comparando o locale da URL */}
            <button 
                onClick={() => handleLanguageChange('pt')} 
                className={locale === 'pt' ? 'active' : ''}
            >
                PT-BR
            </button>
            <button 
                onClick={() => handleLanguageChange('en')} 
                className={locale === 'en' ? 'active' : ''}
            >
                EN
            </button>
        </li>
    )
}