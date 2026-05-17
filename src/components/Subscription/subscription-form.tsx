'use client'
import { loadStripe } from '@stripe/stripe-js';
import { TStyles } from '@/types/stylesType';
import { useCallback, useState } from 'react';
import ChooseMethod from './choose-method';
import { CheckoutFormProvider } from '@stripe/react-stripe-js/checkout';
import { useTheme } from 'next-themes';

const getStripe = (publicKey: string) => loadStripe(publicKey);

interface IProps {
    publicKey: string;
    type: string;
    styles: TStyles;
}
const getClientSecretPromise = async (type: string) => {
    const res = await fetch('/api/subscription/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type }),
    });
    const data = await res.json();
    if (!res.ok || !data?.clientSecret) throw new Error(data?.error || 'Falha ao obter client secret.');
    return data.clientSecret;
};

export default function SubscriptionForm({ publicKey, styles, type }: IProps) {
    const { theme } = useTheme()
    const [clientSecretPromise] = useState(() => getClientSecretPromise(type));

    const appearanceTheme: 'stripe' | 'night' = theme === 'light' ? 'stripe' : 'night';

    const providerOptions = {
        clientSecret: clientSecretPromise,
        appearance: {
            theme: appearanceTheme,
            variables: {
                colorPrimary: '#00E4FF'
            }
        }
    }

    return (
        <CheckoutFormProvider stripe={getStripe(publicKey)} options={providerOptions}>
            <ChooseMethod styles={styles} type={type} />
        </CheckoutFormProvider>
    )
}