'use client'

import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

type Locale = 'pt' | 'en' | 'es' | 'zh';

const locales: Array<{ code: Locale; label: string }> = [
    {
        code: 'pt',
        label: 'PT-BR',
    },
    {
        code: 'en',
        label: 'EN',
    },
    {
        code: 'es',
        label: 'ES',
    },
    {
        code: 'zh',
        label: '中文',
    },
];

export default function LangsWidget() {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();

    const handleLanguageChange = (newLocale: Locale) => {
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <li id='langs'>
            {locales.map(({ code, label }) => (
                <button
                    key={code}
                    onClick={() => handleLanguageChange(code)}
                    className={locale === code ? 'active' : ''}
                >
                    {label}
                </button>
            ))}
        </li>
    );
}