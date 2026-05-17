'use client'
import { useState } from 'react';
import styles from './pay-button.module.scss'
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { useGlobalMessage } from '@/contexts/globalMessageContext';
import LoadingReq from '@/components/Loading/loading-req';
import { useTranslations } from 'next-intl';
import { payOnce, subscribe } from '@/app/[locale]/(subsGroup)/subscription/[type]/actions';
import { useCheckoutElements } from '@stripe/react-stripe-js/checkout';

interface IProps {
    type_subs: string,
    email: string,
    sessionId: string 
}
const PayButton = ({ type_subs, email, sessionId }: IProps) => {
    const stripe = useStripe();
    const checkoutState = useCheckoutElements();
    const [loading, setLoading] = useState(false);
    const { setError, setSucess } = useGlobalMessage()
    const t = useTranslations('SubscriptionPage')

    const handleClick = async () => {
        if (!stripe || checkoutState.type !== 'success') return;

        setLoading(true);

        const emailIsValid = email.match(/^\S+@\S+\.\S+$/)
        if (!emailIsValid) {
            setError(t('errors.email'))
            setLoading(false)
            return;
        }
        const { checkout } = checkoutState;

        try {
            const result = await checkout.confirm({ redirect: "if_required" })
            /* const result = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    payment_method_data: {
                        billing_details: {
                            email: email, 
                        }
                    }
                },
                redirect: "if_required"
            }); */

            if (result.type === 'error') {
                setError(result.error.message || 'Erro ao processar o pagamento.');
                setLoading(false);
                return;
            }

            // Sucesso
            if (type_subs === 'questioplus') subscribe(sessionId);
            if (type_subs === 'questioplususage') payOnce(sessionId);
            
            setSucess('');
        } catch (error: any) {
            setError('Ocorreu um erro inesperado.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <LoadingReq loading={loading} />}
            <button className={styles.botao} disabled={loading || !stripe || checkoutState.type !== 'success'} onClick={handleClick}>
                {loading ? t('inputs.loading') : t('inputs.send')}
            </button>
        </>
    )
};

export default PayButton;