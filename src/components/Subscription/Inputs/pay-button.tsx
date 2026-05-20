'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import styles from './pay-button.module.scss'
import { useCheckoutElements } from '@stripe/react-stripe-js/checkout'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import LoadingReq from '@/components/Loading/loading-req'
import { useLocale, useTranslations } from 'next-intl'
import { getCheckoutSessionStatus } from '@/app/[locale]/(subsGroup)/subscription/[type]/actions'

interface IProps {
    type_subs: string
    email: string
    sessionId: string
}

type ApiError = {
    message?: string
    messagePT?: string
    error?: string
}

const PayButton = ({ type_subs, email, sessionId }: IProps) => {
    const checkoutState = useCheckoutElements()
    const [loading, setLoading] = useState(false)
    const { setError, setSucess } = useGlobalMessage()
    const t = useTranslations('SubscriptionPage')
    const locale = useLocale()
    const router = useRouter()

    const isPt = locale.toLowerCase().startsWith('pt')

    const getApiErrorMessage = (
        error: ApiError | string | undefined | null,
        fallbackKey: string
    ) => {
        const fallbackMessage = t(fallbackKey)

        if (!error) return fallbackMessage

        if (typeof error === 'string') return error

        if (isPt) {
            return (
                error.messagePT ||
                error.message ||
                error.error ||
                fallbackMessage
            )
        }

        return (
            error.message ||
            error.messagePT ||
            error.error ||
            fallbackMessage
        )
    }

    const handleClick = async () => {
        if (checkoutState.type !== 'success') return

        if (!sessionId) {
            setError(t('messages.paymentSessionNotFound'))
            return
        }

        setLoading(true)

        const { checkout } = checkoutState

        const emailResult = await checkout.updateEmail(email)

        if (emailResult.type === 'error') {
            setError(
                emailResult.error.message ||
                t('messages.invalidEmail')
            )

            setLoading(false)
            return
        }

        try {
            const result = await checkout.confirm({ redirect: 'if_required' })

            if (result.type === 'error') {
                setError(
                    result.error.message ||
                    t('messages.paymentProcessError')
                )

                setLoading(false)
                return
            }

            const { res, err } = await getCheckoutSessionStatus(sessionId)

            if (err) {
                setError(
                    getApiErrorMessage(
                        err,
                        'messages.confirmPaymentStatusError'
                    )
                )

                setLoading(false)
                return
            }

            if (!res?.success) {
                setError(t('messages.paymentNotConfirmed'))
                setLoading(false)
                return
            }

            if (type_subs === 'questioplus') {
                setSucess(t('messages.subscriptionSuccess'))
            }

            if (type_subs === 'questioplususage') {
                setSucess(t('messages.paymentSuccess'))
            }

            setTimeout(() => {
                router.push('/home')
            }, 3000)
        } catch (error: any) {
            setError(
                getApiErrorMessage(
                    error,
                    'messages.unexpectedError'
                )
            )
        } finally {
            setLoading(false)
        }
    }

    const canPay =
        checkoutState.type === 'success' &&
        checkoutState.checkout.canConfirm

    return (
        <>
            {loading && <LoadingReq loading={loading} />}

            <button
                className={styles.botao}
                disabled={loading || !canPay}
                onClick={handleClick}
            >
                {loading ? t('inputs.loading') : t('inputs.send')}
            </button>
        </>
    )
}

export default PayButton