'use client'; // Necessário para usar o hook usePathname

import { TStyles } from '@/types/stylesType';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface IProps {
  href: string;
  children: ReactNode;
  styles?: TStyles
}

export default function NavLink({ href, children, styles} : IProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  console.log(isActive)
  return (
    <Link
      href={href}
      className={isActive ? `${styles ? styles.active : 'active'}` : ''}
    >
      {children}
    </Link>
  );
}