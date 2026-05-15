'use client'
import { useState } from 'react';
import styles from './pay-button.module.scss'
import { useCheckout } from '@stripe/react-stripe-js';
import { useGlobalMessage } from '@/contexts/globalMessageContext';
import LoadingReq from '@/components/Loading/loading-req';
import { useTranslations } from 'next-intl';
import { payOnce, subscribe } from '@/app/[locale]/(subsGroup)/subscription/[type]/actions';

interface IProps {
    type_subs: string,
    email: string
}

const PayButton = ({ type_subs, email }: IProps) => {
    const { confirm } = useCheckout();
    const [loading, setLoading] = useState(false);
    const { setError, setSucess } = useGlobalMessage()
    const t = useTranslations('SubscriptionPage')

    const handleClick = () => {
        setLoading(true);

        const emailIsValid = email.match(/^\S+@\S+\.\S+$/)
        if (!emailIsValid) {
            setError(t('errors.email'))
            setLoading(false)
            return;
        }

        confirm({ redirect: "if_required" }).then((result) => {
            if (result.type == 'error') {
                setError(result.error.message)
                setLoading(false)
                return
            }

            if (type_subs === 'questioplus') subscribe(result.session.id)
            if (type_subs === 'questioplususage') payOnce(result.session.id)

            setSucess('')
            setLoading(false);
        }).finally(() => setLoading(false))
    };

    return (
        <>
            {loading && <LoadingReq loading={loading} />}
            <button className={styles.botao} disabled={loading} onClick={handleClick}>
                {loading ? t('inputs.loading') : t('inputs.send')}
            </button>
        </>
    )
};

export default PayButton;