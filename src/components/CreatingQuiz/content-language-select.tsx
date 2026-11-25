'use client'
import { CONTENT_LANGUAGES, ContentLanguage } from '@/utils/contentLanguages'

interface IProps {
    value: ContentLanguage
    onChange: (value: ContentLanguage) => void
    id?: string
    // texto abaixo do campo (o idioma do conteúdo não muda o endereço do quiz)
    describedBy?: string
}

// Seleção do idioma em que o quiz foi escrito, com todos os idiomas aceitos (não só os da
// interface). Os nomes aparecem na própria língua.
export default function ContentLanguageSelect({ value, onChange, id = 'lang', describedBy }: IProps) {
    return (
        <select id={id} value={value} aria-describedby={describedBy} onChange={e => onChange(e.target.value as ContentLanguage)}>
            {CONTENT_LANGUAGES.map(language => (
                <option key={language.code} value={language.code} lang={language.tag}>{language.name}</option>
            ))}
        </select>
    )
}
