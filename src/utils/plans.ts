import { Currency, getDefaultCurrencyByLocale } from '@/utils/currency'

// Uma oferta do Stripe, como o backend devolve em /plans
export interface IPlanOffer {
    plan: 'plus' | 'usage'
    currency: string
    market?: string
    priceId: string
    // na menor unidade da moeda (centavos)
    unitAmount: number
    interval: 'day' | 'week' | 'month' | 'year' | null
    intervalCount: number | null
}

// quem usa o site em chinês tem a oferta da China (em dólar), quando ela existir no Stripe
export const marketForLocale = (locale: string) => locale.toLowerCase().startsWith('zh') ? 'cn' : undefined

// A oferta de um plano na moeda pedida: a do mercado, se houver, senão a normal da moeda
export function findOffer(offers: IPlanOffer[], plan: IPlanOffer['plan'], currency: Currency | undefined, locale: string): IPlanOffer | undefined {
    const wanted = (currency ?? getDefaultCurrencyByLocale(locale)).toLowerCase(),
    market = marketForLocale(locale),
    candidates = offers.filter(offer => offer.plan === plan && offer.currency === wanted)

    return candidates.find(offer => market && offer.market === market) ?? candidates.find(offer => !offer.market)
}

// Valor formatado na moeda e no idioma (casas decimais da própria moeda)
export function formatOfferPrice(offer: IPlanOffer, locale: string): string {
    const currency = offer.currency.toUpperCase(),
    digits = new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2

    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(offer.unitAmount / 10 ** digits)
}

let request: Promise<IPlanOffer[]> | null = null

// Uma busca por visita; uma falha não fica guardada (tenta de novo na próxima vez)
export function loadPlanOffers(): Promise<IPlanOffer[]> {
    request ??= fetch('/api/plans')
        .then(async response => {
            const data = await response.json()
            if (!response.ok || !Array.isArray(data?.offers)) throw new Error('prices unavailable')
            return data.offers as IPlanOffer[]
        })
        .catch(error => {
            request = null
            throw error
        })
    return request
}
