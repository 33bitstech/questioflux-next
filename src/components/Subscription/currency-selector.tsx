'use client'

import { Currency, currencies } from '@/utils/currency'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

interface IProps {
    currency: Currency
    className?: string
    activeClassName?: string
}

export default function CurrencySelector({
    currency,
    className,
    activeClassName,
}: IProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const t = useTranslations('SubscriptionPage.currency')

    const handleChangeCurrency = (newCurrency: Currency) => {
        const params = new URLSearchParams(searchParams.toString())

        params.set('currency', newCurrency)

        router.replace(`${pathname}?${params.toString()}`, {
            scroll: false,
        })
    }

    return (
        <div className={className} aria-label={t('label')}>
            {currencies.map((currencyOption) => (
                <button
                    key={currencyOption}
                    type="button"
                    onClick={() => handleChangeCurrency(currencyOption)}
                    className={currency === currencyOption ? activeClassName : ''}
                    aria-pressed={currency === currencyOption}
                >
                    {currencyOption}
                </button>
            ))}
        </div>
    )
}