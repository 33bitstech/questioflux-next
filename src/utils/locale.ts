export type AppLocale = 'en' | 'pt' | 'es' | 'zh'

export const getAppLocale = (locale?: string): AppLocale => {
    if (locale?.startsWith('pt')) return 'pt'
    if (locale?.startsWith('es')) return 'es'
    if (locale?.startsWith('zh')) return 'zh'

    return 'en'
}

export const getIntlLocale = (locale?: string) => {
    const intlLocales: Record<AppLocale, string> = {
        en: 'en-US',
        pt: 'pt-BR',
        es: 'es-ES',
        zh: 'zh-CN',
    }

    return intlLocales[getAppLocale(locale)]
}
export const getOpenGraphLocale = (locale?: string) => {
    const openGraphLocales: Record<AppLocale, string> = {
        en: 'en_US',
        pt: 'pt_BR',
        es: 'es_ES',
        zh: 'zh_CN',
    }

    return openGraphLocales[getAppLocale(locale)]
}