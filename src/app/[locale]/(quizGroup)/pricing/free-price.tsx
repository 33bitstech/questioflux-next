'use client'
import { useLocale } from 'next-intl'
import { useSubscriptionCurrency } from '@/contexts/subscriptionCurrencyContext'

// "R$ 0", "$0", "0 €": o plano grátis na mesma moeda que os outros cartões mostram
export default function FreePrice({ className }: { className?: string }) {
    const locale = useLocale()
    const { currency } = useSubscriptionCurrency()

    const price = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(0)

    return <span className={className}>{price}</span>
}
