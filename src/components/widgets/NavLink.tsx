'use client';

import { TStyles } from '@/types/stylesType';
import { Link } from '@/i18n/navigation';
import { usePathname } from '@/i18n/navigation';
import { LinkHTMLAttributes, ReactNode } from 'react';
import { useLocale } from 'next-intl';

interface IProps extends LinkHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children: ReactNode;
    styles?: TStyles;
    isBlock?: boolean;
    replace?: boolean;
}

export default function NavLink({ href, children, styles, isBlock, className, replace, ...others }: IProps) {
    const pathname = usePathname();
    const isActive = pathname === href;
    const locale = useLocale();

    let classe = className || '';
    if (isActive) classe += styles ? ` ${styles.active}` : ' active';
    if (isBlock) classe += styles ? ` ${styles.blocked}` : '';

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isActive) return e.preventDefault()
    }

    return (
        <Link
            {...others}
            href={isBlock ? '#' : href}
            className={classe}
            locale={locale}
            onClick={handleClick}
            replace={replace}
        >
            {children}
        </Link>
    );
}