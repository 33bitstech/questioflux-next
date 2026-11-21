'use client'

import { GoogleIcon } from '@/components/Icons/GoogleIcon'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import styles from './google-auth-button.module.scss'
import { env } from '@/env'

// Login com Google no meio de algo que não pode se perder (o fim de um quiz): o backend
// devolve a pessoa para path, com ou sem erro, e onLeave guarda o que precisa antes de sair.
// Sem isso, a volta é para o login no idioma da pessoa: com erro, a página mostra a mensagem;
// com sucesso, o login (já logado) leva para a home no mesmo idioma.
export interface IGoogleReturn {
    path: string
    onLeave: () => void
}

interface IGoogleAuthButtonProps {
    locale?: string
    separatorBelow?: boolean
    googleReturn?: IGoogleReturn
}

export default function GoogleAuthButton({ separatorBelow = false, googleReturn }: IGoogleAuthButtonProps) {
    const t = useTranslations('googleAuth')
    const locale = useLocale()
    const [loading, setLoading] = useState(false)

    // voltar do Google pelo botão "voltar" do navegador restaura a página como estava: sem
    // isto o botão ficava girando
    useEffect(() => {
        const reset = (event: PageTransitionEvent) => { if (event.persisted) setLoading(false) }
        window.addEventListener('pageshow', reset)
        return () => window.removeEventListener('pageshow', reset)
    }, [])

    const handleGoogleSignIn = () => {
        try {
            setLoading(true)
            googleReturn?.onLeave()
            const returnTo = googleReturn?.path ?? `/${locale}/login`
            window.location.href = `${env.NEXT_PUBLIC_DOMAIN_API}/oauth/link?returnTo=${encodeURIComponent(returnTo)}`
        } catch (err) {
            console.error(err)
            setLoading(false)
        }
    }

    const separator = (
        <div className={styles.separator}>
            <span className={styles.separatorLine} />
            <span className={styles.separatorText}>{t('separator')}</span>
            <span className={styles.separatorLine} />
        </div>
    )

    const btn = (
        <button
            type="button"
            className={`${styles.btn} ${loading ? styles.btnLoading : ''}`}
            onClick={handleGoogleSignIn}
            disabled={loading}
        >
            {loading ? (
                <span className={styles.btnSpinner} />
            ) : (
                <GoogleIcon />
            )}
            <span>{loading ? t('loading') : t('button')}</span>
        </button>
    )

    return (
        <div className={styles.wrapper}>
            {separatorBelow ? (
                <>
                    {btn}
                    {separator}
                </>
            ) : (
                <>
                    {separator}
                    {btn}
                </>
            )}
        </div>
    )
}
