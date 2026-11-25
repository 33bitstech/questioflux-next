// Idioma do conteúdo (campo idiom do quiz): a língua em que as perguntas foram escritas.
// É separado do idioma da interface (pt, en, es, zh), que só decide os textos do site.
// Os nomes ficam na própria língua (endônimos), como nos seletores de idioma em geral.
// Mesma lista do backend (src/utils/contentLanguage.ts).
export const CONTENT_LANGUAGES = [
    // idiomas da interface primeiro
    { code: 'PT-BR', name: 'Português', tag: 'pt-BR' },
    { code: 'EN-US', name: 'English', tag: 'en-US' },
    { code: 'ES-ES', name: 'Español', tag: 'es' },
    { code: 'ZH-CN', name: '中文', tag: 'zh-CN' },
    { code: 'FR-FR', name: 'Français', tag: 'fr' },
    { code: 'IT-IT', name: 'Italiano', tag: 'it' },
    { code: 'DE-DE', name: 'Deutsch', tag: 'de' },
    { code: 'RU-RU', name: 'Русский', tag: 'ru' },
    { code: 'AR', name: 'العربية', tag: 'ar' },
    { code: 'FA-IR', name: 'فارسی', tag: 'fa' },
    { code: 'TR-TR', name: 'Türkçe', tag: 'tr' },
    { code: 'JA-JP', name: '日本語', tag: 'ja' },
    { code: 'KO-KR', name: '한국어', tag: 'ko' },
    { code: 'HI-IN', name: 'हिन्दी', tag: 'hi' },
    { code: 'ID-ID', name: 'Bahasa Indonesia', tag: 'id' },
    { code: 'PL-PL', name: 'Polski', tag: 'pl' },
    { code: 'NL-NL', name: 'Nederlands', tag: 'nl' },
    { code: 'UK-UA', name: 'Українська', tag: 'uk' },
    { code: 'VI-VN', name: 'Tiếng Việt', tag: 'vi' },
    { code: 'TH-TH', name: 'ไทย', tag: 'th' },
    { code: 'HE-IL', name: 'עברית', tag: 'he' },
    { code: 'SV-SE', name: 'Svenska', tag: 'sv' },
    { code: 'EL-GR', name: 'Ελληνικά', tag: 'el' },
    { code: 'RO-RO', name: 'Română', tag: 'ro' },
] as const

export type ContentLanguage = typeof CONTENT_LANGUAGES[number]['code']

// quizzes antigos guardam 'en'
const LEGACY: Record<string, ContentLanguage> = { en: 'EN-US', pt: 'PT-BR', es: 'ES-ES', zh: 'ZH-CN' }

export function normalizeContentLanguage(value?: string | null): ContentLanguage | undefined {
    if (!value) return undefined
    const upper = value.toUpperCase()
    return CONTENT_LANGUAGES.find(language => language.code === upper)?.code ?? LEGACY[value.toLowerCase()]
}

// código curto do idioma ('fr' em 'FR-FR'), o mesmo do filtro do Explorar (?lang=fr)
export const contentLanguageBase = (code: string) => code.split('-')[0].toLowerCase()

// etiqueta BCP 47 do conteúdo (inLanguage dos dados estruturados, lang do texto do quiz)
export const contentLanguageTag = (idiom?: string | null): string | undefined => {
    const code = normalizeContentLanguage(idiom)
    return CONTENT_LANGUAGES.find(language => language.code === code)?.tag
}

export const contentLanguageName = (idiom?: string | null): string | undefined => {
    const code = normalizeContentLanguage(idiom)
    return CONTENT_LANGUAGES.find(language => language.code === code)?.name
}
