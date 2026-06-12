'use client'

import { TStyles } from '@/types/stylesType'
import ChooseMethod from './choose-method'
import { useSubscriptionCurrency } from '@/contexts/subscriptionCurrencyContext'

interface IProps {
    publicKey: string
    type: string
    styles: TStyles
}

export default function SubscriptionForm({
    publicKey,
    styles,
    type,
}: IProps) {
    const { currency } = useSubscriptionCurrency()

    return (
        <ChooseMethod
            styles={styles}
            type={type}
            publicKey={publicKey}
            currency={currency}
        />
    )

    // return <PaymentMaintenanceMessage />
}