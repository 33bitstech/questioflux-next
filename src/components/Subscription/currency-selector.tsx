'use client'

import { useSubscriptionCurrency } from '@/contexts/subscriptionCurrencyContext'
import {
    currencyLabels,
    getCurrencyOptionsByLocale,
    shouldShowCurrencySelector,
} from '@/utils/currency'
import { useTranslations } from 'next-intl'

interface IProps {
    className?: string
    activeClassName?: string
}

export default function CurrencySelector({
    className,
    activeClassName,
}: IProps) {
    const t = useTranslations('SubscriptionPage.currency')

    const {
        locale,
        currency,
        setCurrency,
    } = useSubscriptionCurrency()

    if (!shouldShowCurrencySelector(locale)) {
        return null
    }

    const currencyOptions = getCurrencyOptionsByLocale(locale)

    return (
        <div className={className} aria-label={t('label')}>
            {currencyOptions.map((currencyOption) => (
                <button
                    key={currencyOption}
                    type="button"
                    onClick={() => setCurrency(currencyOption)}
                    className={currency === currencyOption ? activeClassName : ''}
                    aria-pressed={currency === currencyOption}
                    title={currencyLabels[currencyOption]}
                >
                    {currencyOption}
                </button>
            ))}
        </div>
    )
}