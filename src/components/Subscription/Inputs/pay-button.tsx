'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './pay-button.module.scss'
import { useCheckoutElements } from '@stripe/react-stripe-js/checkout'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import LoadingReq from '@/components/Loading/loading-req'
import { useTranslations } from 'next-intl'
import { getCheckoutSessionStatus } from '@/app/[locale]/(subsGroup)/subscription/[type]/actions'

interface IProps {
    type_subs: string
    email: string
    sessionId: string
}

const PayButton = ({ type_subs, email, sessionId }: IProps) => {
    const checkoutState = useCheckoutElements()
    const [loading, setLoading] = useState(false)
    const { setError, setSucess } = useGlobalMessage()
    const t = useTranslations('SubscriptionPage')
    const router = useRouter()

    const handleClick = async () => {
        if (checkoutState.type !== 'success') return

        if (!sessionId) {
            setError('Sessão de pagamento não encontrada.')
            return
        }

        setLoading(true)

        const { checkout } = checkoutState

        const emailResult = await checkout.updateEmail(email)

        if (emailResult.type === 'error') {
            setError(emailResult.error.message)
            setLoading(false)
            return
        }

        try {
            const result = await checkout.confirm({ redirect: 'if_required' })

            if (result.type === 'error') {
                setError(result.error.message || 'Erro ao processar o pagamento.')
                setLoading(false)
                return
            }

            const { res, err } = await getCheckoutSessionStatus(sessionId)

            if (err) {
                setError(
                    err.messagePT ||
                    err.message ||
                    'Não foi possível confirmar o status do pagamento.'
                )
                setLoading(false)
                return
            }

            if (!res?.success) {
                setError('O pagamento ainda não foi confirmado.')
                setLoading(false)
                return
            }

            if (type_subs === 'questioplus') {
                setSucess('Assinatura ativada com sucesso.')
            }

            if (type_subs === 'questioplususage') {
                setSucess('Pagamento confirmado com sucesso.')
            }

            router.refresh()
        } catch (error: any) {
            setError(
                error?.messagePT ||
                error?.message ||
                'Ocorreu um erro inesperado.'
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