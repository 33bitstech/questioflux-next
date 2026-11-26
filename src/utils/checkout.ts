import type { StripeElementLocale } from '@stripe/stripe-js'
import type { IPlanOffer } from '@/utils/plans'

// As duas páginas de checkout (/subscription/questioplus e /subscription/questioplususage)
export const CHECKOUT_PLANS = ['questioplus', 'questioplususage'] as const
export type CheckoutPlan = typeof CHECKOUT_PLANS[number]

export const isCheckoutPlan = (value: string): value is CheckoutPlan =>
    (CHECKOUT_PLANS as readonly string[]).includes(value)

// o plano do /plans (preço do Stripe) de cada página
export const offerPlanOf = (type: CheckoutPlan): IPlanOffer['plan'] =>
    type === 'questioplus' ? 'plus' : 'usage'

// Idioma do formulário do Stripe: o da página, nunca o do navegador. Em espanhol, quem paga
// em euro está na Espanha; em dólar, na América Latina.
export function stripeLocaleFor(locale: string, currency?: string): StripeElementLocale {
    const language = locale.split('-')[0]

    if (language === 'pt') return 'pt-BR'
    if (language === 'es') return currency === 'EUR' ? 'es' : 'es-419'
    if (language === 'zh') return 'zh'

    return 'en'
}
