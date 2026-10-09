'use client'
import { ComponentProps, ReactNode, useEffect, useRef } from 'react'
import { Link } from '@/i18n/navigation'
import { AnalyticsEvent, trackEvent } from '@/utils/analytics'

type EventParams = Parameters<typeof trackEvent>[1]

interface IEvent {
    event: AnalyticsEvent
    params?: EventParams
}

// Peças pequenas para páginas que são Server Components dispararem eventos.

// Dispara uma vez quando a página aparece.
export function TrackOnView({ event, params }: IEvent) {
    const key = JSON.stringify(params)

    useEffect(() => {
        trackEvent(event, params)
    }, [event, key])

    return null
}

// <details> que avisa a primeira vez que é aberto.
export function TrackedDetails({ event, params, children }: IEvent & { children: ReactNode }) {
    const sent = useRef(false)

    return (
        <details
            onToggle={(e) => {
                if (!e.currentTarget.open || sent.current) return
                sent.current = true
                trackEvent(event, params)
            }}
        >
            {children}
        </details>
    )
}

// Link que avisa o clique.
export function TrackedLink({ event, params, ...props }: IEvent & ComponentProps<typeof Link>) {
    return <Link {...props} onClick={() => trackEvent(event, params)} />
}
