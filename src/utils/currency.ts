export const currencies = ['USD', 'BRL'] as const

export type Currency = typeof currencies[number]

const defaultCurrencyByLocale = {
    en: 'USD',
    pt: 'BRL',
    es: 'USD',
} as const

export function getDefaultCurrencyByLocale(locale?: string): Currency {
    const normalizedLocale = locale?.split('-')[0] as keyof typeof defaultCurrencyByLocale

    return defaultCurrencyByLocale[normalizedLocale] ?? 'USD'
}

export function normalizeCurrency(currency?: unknown, locale?: string): Currency {
    if (typeof currency !== 'string') {
        return getDefaultCurrencyByLocale(locale)
    }

    const normalizedCurrency = currency.toUpperCase()

    const validCurrency = currencies.find(currency => currency === normalizedCurrency)

    return validCurrency ?? getDefaultCurrencyByLocale(locale)
}