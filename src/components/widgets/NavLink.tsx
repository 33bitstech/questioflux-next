'use client'; // Necessário para usar o hook usePathname

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface IProps {
  href: string;
  children: ReactNode;
}

export default function NavLink({ href, children } : IProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={isActive ? `active` : ''}
    >
      {children}
    </Link>
  );
}