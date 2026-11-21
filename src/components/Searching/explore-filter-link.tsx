'use client'

import { ReactNode } from 'react'
import { useLinkStatus } from 'next/link'
import { Link } from '@/i18n/navigation'
import { TStyles } from '@/types/stylesType'

interface IProps {
    styles: TStyles
    href: string
    active: boolean
    // nome completo do filtro: dica ao passar o mouse e texto para leitores de tela
    label: string
    className: string
    children: ReactNode
}

// Um filtro rápido do Explorar: é um link (o filtro fica no endereço) e mostra que está
// carregando enquanto a lista nova vem do servidor
export default function ExploreFilterLink({ styles, href, active, label, className, children }: IProps) {
    return (
        <Link
            href={href}
            scroll={false}
            className={[className, active ? styles.filter_active : ''].filter(Boolean).join(' ')}
            aria-current={active ? 'true' : undefined}
            aria-label={label}
            title={label}
        >
            {children}
            <PendingMark className={styles.filter_pending} />
        </Link>
    )
}

function PendingMark({ className }: { className: string }) {
    const { pending } = useLinkStatus()
    return pending ? <span className={className} aria-hidden="true" /> : null
}
