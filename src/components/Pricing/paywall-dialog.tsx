'use client'
import { KeyboardEvent, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useLocale, useTranslations } from 'next-intl'
import { Sparkles, X } from 'lucide-react'
import styles from './paywall-dialog.module.scss'

interface IProps {
    feature: 'images' | 'tournament'
    onClose: () => void
}

const FOCUSABLE = 'a[href], button:not([disabled])'

// Aviso curto de recurso pago, aberto pelo editor quando a pessoa escolhe algo do QuestioPlus.
// A página de planos abre em outra aba para não perder o que está sendo editado.
export default function PaywallDialog({ feature, onClose }: IProps) {
    const t = useTranslations('paywall')
    const locale = useLocale()
    const dialogRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const previous = document.activeElement as HTMLElement | null
        dialogRef.current?.focus()
        return () => previous?.focus?.()
    }, [])

    // Esc fecha; Tab circula só pelos botões do aviso
    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Escape') {
            event.stopPropagation()
            onClose()
            return
        }
        if (event.key !== 'Tab' || !dialogRef.current) return

        const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
        if (!items.length) return
        const first = items[0], last = items[items.length - 1]

        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
            event.preventDefault()
            last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first.focus()
        }
    }

    if (typeof document === 'undefined') return null

    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="paywall-title"
                aria-describedby="paywall-text"
                tabIndex={-1}
                className={styles.dialog}
                onClick={event => event.stopPropagation()}
                onKeyDown={onKeyDown}
            >
                <button type="button" className={styles.close} onClick={onClose} aria-label={t('close')}>
                    <X aria-hidden="true" />
                </button>
                <span className={styles.icon}><Sparkles aria-hidden="true" /></span>
                <h2 id="paywall-title">{t(`${feature}Title`)}</h2>
                <p id="paywall-text">{t(`${feature}Text`)}</p>
                <div className={styles.actions}>
                    <a href={`/${locale}/pricing`} target="_blank" rel="noopener" className={styles.primary}>{t('seePlans')}</a>
                    <button type="button" className={styles.secondary} onClick={onClose}>{t('close')}</button>
                </div>
                <p className={styles.note}>{t('note')}</p>
            </div>
        </div>,
        document.body
    )
}
