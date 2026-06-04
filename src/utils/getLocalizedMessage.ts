import { AppLocale, getAppLocale } from './locale'

export type LocalizedMessage = {
    message?: string
    messagePT?: string
    messageES?: string
}

const defaultFallbacks: Record<AppLocale, string> = {
    en: 'An unexpected error occurred.',
    pt: 'Ocorreu um erro inesperado.',
    es: 'Ocurrió un error inesperado.',
}

export const getLocalizedMessage = (
    data: LocalizedMessage | undefined,
    locale: string,
    fallback?: string
) => {
    const appLocale = getAppLocale(locale)

    const messages: Record<AppLocale, string | undefined> = {
        en: data?.message,
        pt: data?.messagePT,
        es: data?.messageES,
    }

    return (
        messages[appLocale] ||
        data?.message ||
        data?.messagePT ||
        data?.messageES ||
        fallback ||
        defaultFallbacks[appLocale]
    )
}