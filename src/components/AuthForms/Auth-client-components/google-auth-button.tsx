'use client'

import { GoogleIcon } from '@/components/Icons/GoogleIcon'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import styles from './google-auth-button.module.scss'

interface IGoogleAuthButtonProps {
    locale?: string
    separatorBelow?: boolean
}

export default function GoogleAuthButton({ locale, separatorBelow = false }: IGoogleAuthButtonProps) {
    const t = useTranslations('googleAuth')
    const [loading, setLoading] = useState(false)

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true)
            window.location.href = 'https://api.questioflux.com/oauth/link'
            // Omiti o setLoading(false) aqui (veja as sugestões de melhoria abaixo)
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