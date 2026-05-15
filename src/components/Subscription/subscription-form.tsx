'use client'
import { loadStripe } from '@stripe/stripe-js';
import { CheckoutProvider } from '@stripe/react-stripe-js';
import { TStyles } from '@/types/stylesType';
import { useCallback } from 'react';
import ChooseMethod from './choose-method';

const getStripe = (publicKey: string) => loadStripe(publicKey);

interface IProps {
    publicKey: string;
    type: string;
    styles: TStyles;
}

export default function SubscriptionForm({ publicKey, styles, type }: IProps) {
    const fetchClientSecret = useCallback(async () => {
        const res = await fetch('/api/subscription/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ type }),
        })
        const data = await res.json()
        if (!res.ok || !data?.clientSecret) throw new Error(data?.error || 'Falha ao obter client secret.')
        return data.clientSecret
    }, [type])

    const options = { fetchClientSecret }

    return (
        <CheckoutProvider stripe={getStripe(publicKey)} options={options}>
            <ChooseMethod styles={styles} type={type} />
        </CheckoutProvider>
    )
}