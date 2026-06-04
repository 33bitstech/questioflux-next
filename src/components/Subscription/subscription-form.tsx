'use client'

import { TStyles } from '@/types/stylesType'
import ChooseMethod from './choose-method'
import { Currency } from '@/utils/currency'

interface IProps {
    publicKey: string
    type: string
    styles: TStyles
    currency: Currency
}

export default function SubscriptionForm({
    publicKey,
    styles,
    type,
    currency,
}: IProps) {
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