'use client'

import {
    Currency,
    getDefaultCurrencyByLocale,
} from '@/utils/currency'
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react'

interface ISubscriptionCurrencyContext {
    locale: string
    currency: Currency
    setCurrency: (currency: Currency) => void
}

const SubscriptionCurrencyContext = createContext({} as ISubscriptionCurrencyContext)

export function SubscriptionCurrencyProvider({
    locale,
    children,
}: {
    locale: string
    children: ReactNode
}) {
    const [currency, setCurrency] = useState<Currency>(
        getDefaultCurrencyByLocale(locale)
    )

    useEffect(() => {
        setCurrency(getDefaultCurrencyByLocale(locale))
    }, [locale])

    return (
        <SubscriptionCurrencyContext.Provider
            value={{
                locale,
                currency,
                setCurrency,
            }}
        >
            {children}
        </SubscriptionCurrencyContext.Provider>
    )
}

export const useSubscriptionCurrency = () => {
    return useContext(SubscriptionCurrencyContext)
}