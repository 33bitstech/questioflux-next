'use client'
import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useSubscriptionCurrency } from '@/contexts/subscriptionCurrencyContext'
import { findOffer, formatOfferPrice, IPlanOffer, loadPlanOffers } from '@/utils/plans'

interface IProps {
    plan: IPlanOffer['plan']
    className?: string
}

// Preço de um plano como está no Stripe agora, na moeda da pessoa ("R$ 2,50/mês").
// Sem preço válido não mostra valor nenhum: avisa que está indisponível.
export default function PlanPrice({ plan, className }: IProps) {
    const t = useTranslations('pricing')
    const locale = useLocale()
    // fora da página de assinatura não há seletor: vale a moeda padrão do idioma
    const { currency } = useSubscriptionCurrency()
    const [offers, setOffers] = useState<IPlanOffer[] | null | undefined>(undefined)

    useEffect(() => {
        let active = true
        loadPlanOffers().then(list => active && setOffers(list)).catch(() => active && setOffers(null))
        return () => { active = false }
    }, [])

    if (offers === undefined) return <span className={className} aria-busy="true">{t('loading')}</span>

    const offer = offers && findOffer(offers, plan, currency, locale)
    if (!offer) return <span className={className}>{t('unavailable')}</span>

    const price = formatOfferPrice(offer, locale)
    return (
        <span className={className}>
            {offer.interval === 'month' ? t('perMonth', { price }) : offer.interval === 'year' ? t('perYear', { price }) : t('perUse', { price })}
        </span>
    )
}
