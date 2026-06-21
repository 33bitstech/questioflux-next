'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import styles from './email-confirm.module.scss'
import { confirmEmailChange } from './action'

interface IProps {
    token?: string
}

export default function EmailConfirmClient({ token }: IProps) {
    const t = useTranslations('emailConfirmPage')
    const router = useRouter()

    const hasFetched = useRef(false)

    useEffect(() => {
        if (!token) {
            router.replace('/email-verification?status=error')
            return
        }

        if (hasFetched.current) return
        hasFetched.current = true

        const validateToken = async () => {
            try {
                const res = await confirmEmailChange(token)

                if (res.err) {
                    router.replace('/email-verification?status=error')
                } else {
                    router.replace('/email-verification?status=success')
                }
            } catch (error) {
                router.replace('/email-verification?status=error')
            }
        }

        validateToken()
    }, [token, router])

    return (
        <div className={styles.container}>
            <div className={styles.spinner}></div>
            <h1>{t('loading')}</h1>
        </div>
    )
}