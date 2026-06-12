import { getAppLocale } from '@/utils/locale'

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

const currencyOptionsByLocale = {
    en: ['USD'],
    pt: ['BRL'],
    es: ['MXN', 'ARS', 'COP', 'CLP', 'UYU', 'DOP', 'EUR'],
} satisfies Record<string, Currency[]>

export function getCurrencyOptionsByLocale(locale?: string): Currency[] {
    const appLocale = getAppLocale(locale)

    return currencyOptionsByLocale[appLocale] ?? ['USD']
}

export function getDefaultCurrencyByLocale(locale?: string): Currency {
    return getCurrencyOptionsByLocale(locale)[0] ?? 'USD'
}

export function normalizeCurrency(currency?: unknown, locale?: string): Currency {
    if (typeof currency !== 'string') {
        return getDefaultCurrencyByLocale(locale)
    }

    const normalizedCurrency = currency.toUpperCase() as Currency
    const options = getCurrencyOptionsByLocale(locale)

    if (options.includes(normalizedCurrency)) {
        return normalizedCurrency
    }

    return getDefaultCurrencyByLocale(locale)
}

export function shouldShowCurrencySelector(locale?: string) {
    return getAppLocale(locale) === 'es'
}