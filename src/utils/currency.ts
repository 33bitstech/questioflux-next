export const supportedCurrencies = [
    'USD',
    'BRL',
    'MXN',
    'ARS',
    'COP',
    'CLP',
    'UYU',
    'DOP',
    'EUR',
] as const

export type Currency = typeof supportedCurrencies[number]

const currencyOptionsByLocale = {
    en: ['USD'],
    pt: ['BRL'],
    es: ['MXN', 'ARS', 'COP', 'CLP', 'UYU', 'DOP', 'EUR'],
} satisfies Record<string, Currency[]>

export function getDefaultCurrencyByLocale(locale?: string): Currency {
    const normalizedLocale = locale?.split('-')[0]

    if (normalizedLocale === 'pt') return 'BRL'
    if (normalizedLocale === 'es') return 'MXN'

    return 'USD'
}

export function getCurrencyOptionsByLocale(locale?: string): Currency[] {
    const normalizedLocale = locale?.split('-')[0]

    if (normalizedLocale === 'pt') return currencyOptionsByLocale.pt
    if (normalizedLocale === 'es') return currencyOptionsByLocale.es

    return currencyOptionsByLocale.en
}

export function normalizeCurrency(currency?: unknown, locale?: string): Currency {
    if (typeof currency !== 'string') {
        return getDefaultCurrencyByLocale(locale)
    }

    const normalizedCurrency = currency.toUpperCase() as Currency
    const currencyOptions = getCurrencyOptionsByLocale(locale)

    if (currencyOptions.includes(normalizedCurrency)) {
        return normalizedCurrency
    }

    return getDefaultCurrencyByLocale(locale)
}

export function currencyToApiParam(currency: Currency) {
    return currency.toLowerCase()
}

export function shouldShowCurrencySelector(locale?: string) {
    return locale?.split('-')[0] === 'es'
}

export const currencyLabels: Record<Currency, string> = {
    USD: 'US Dollar',
    BRL: 'Real Brasileiro',
    MXN: 'Peso Mexicano',
    ARS: 'Peso Argentino',
    COP: 'Peso Colombiano',
    CLP: 'Peso Chileno',
    UYU: 'Peso Uruguaio',
    DOP: 'Peso Dominicano',
    EUR: 'Euro',
}