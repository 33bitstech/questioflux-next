'use client'
import { ReactNode } from 'react'
import { trackEvent } from '@/utils/analytics'

interface IProps {
    targetId: string
    className?: string
    children: ReactNode
}

// Botão da landing que rola até uma seção da própria página (o de "Comece agora" vai para a
// criação de quiz, não direto ao cadastro). O href mantém o salto sem JavaScript.
export default function ScrollToSection({ targetId, className, children }: IProps) {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        trackEvent('select_content', { content_type: 'landing_cta', item_id: targetId })

        const target = document.getElementById(targetId)
        if (!target) return

        e.preventDefault()
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
        history.replaceState(null, '', `#${targetId}`)
    }

    return <a href={`#${targetId}`} className={className} onClick={handleClick}>{children}</a>
}
