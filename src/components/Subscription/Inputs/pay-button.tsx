'use client'
import { useState } from 'react';
import styles from './pay-button.module.scss'
import { useCheckoutElements } from '@stripe/react-stripe-js/checkout';
import { useGlobalMessage } from '@/contexts/globalMessageContext';
import LoadingReq from '@/components/Loading/loading-req';
import { useTranslations } from 'next-intl';
import { payOnce, subscribe } from '@/app/[locale]/(subsGroup)/subscription/[type]/actions';

interface IProps {
    type_subs: string,
    email: string,
    sessionId: string
}

const PayButton = ({ type_subs, email, sessionId }: IProps) => {
    const checkoutState = useCheckoutElements();
    const [loading, setLoading] = useState(false);
    const { setError, setSucess } = useGlobalMessage()
    const t = useTranslations('SubscriptionPage')

    const handleClick = async () => {
        if (checkoutState.type !== 'success') return;

        setLoading(true);

        const { checkout } = checkoutState;

        // Valida o e-mail via API do Stripe (substitui a regex manual)
        const emailResult = await checkout.updateEmail(email)
        if (emailResult.type === 'error') {
            setError(emailResult.error.message)
            setLoading(false)
            return;
        }

        try {
            const result = await checkout.confirm({ redirect: "if_required" })

            if (result.type === 'error') {
                setError(result.error.message || 'Erro ao processar o pagamento.');
                setLoading(false);
                return;
            }

            //if (type_subs === 'questioplus') subscribe(sessionId);
            if (type_subs === 'questioplususage') payOnce(sessionId);

            setSucess('');
        } catch (error: any) {
            setError('Ocorreu um erro inesperado.');
        } finally {
            setLoading(false);
        }
    };

    const canPay = checkoutState.type === 'success' && checkoutState.checkout.canConfirm;

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
};

export default PayButton;