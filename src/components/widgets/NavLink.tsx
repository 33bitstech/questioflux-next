'use client'; 

import { TStyles } from '@/types/stylesType';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LinkHTMLAttributes, ReactNode } from 'react';

interface IProps extends LinkHTMLAttributes<HTMLAnchorElement>{
  href: string;
  children: ReactNode;
  styles?: TStyles
  isBlock?: boolean
}

export default function NavLink({ href, children, styles, isBlock, className ,...others} : IProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  let classe = className
  if(isActive) classe += styles ? ` ${styles.active}` : ' active'
  if(isBlock) classe += styles ? ` ${styles.blocked}` : ''

  return (
    <Link
      {...others}
      href={isBlock ? '#' : href}
      //className={isActive ? `${styles ? styles.active : 'active'}` : ''}
      className={classe}
    >
      {children}
    </Link>
  );
}