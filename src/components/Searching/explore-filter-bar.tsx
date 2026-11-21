import { getTranslations } from 'next-intl/server'
import { Brain, GraduationCap, ImageIcon, ListChecks, LucideIcon, UserRound } from 'lucide-react'
import ExploreFilterLink from './explore-filter-link'
import { TStyles } from '@/types/stylesType'
import {
    EXPLORE_LANGS, EXPLORE_TYPE_SLUGS, exploreHref, ExploreLang, ExploreType, IExploreFilters,
} from '@/utils/exploreFilters'

interface IProps {
    styles: TStyles
    filters: IExploreFilters
    locale: string
}

const TYPE_ICONS: Record<ExploreType, LucideIcon> = {
    'questions-and-answers': ListChecks,
    'exam': GraduationCap,
    'about-me': UserRound,
    'personality': Brain,
    'image': ImageIcon,
}

// chave em quizTypes
const TYPE_NAMES: Record<ExploreType, string> = {
    'questions-and-answers': 'names.quiz',
    'exam': 'names.exam',
    'about-me': 'names.aboutMe',
    'personality': 'names.personality',
    'image': 'image',
}

// cada idioma no próprio idioma, como no seletor de idioma do site
export const LANG_NAMES: Record<ExploreLang, string> = {
    en: 'English',
    pt: 'Português',
    es: 'Español',
    zh: '中文',
}

// Filtros rápidos do Explorar: idioma dos quizzes à esquerda, tipo à direita (ícones). Clicar
// no filtro ativo tira o filtro; trocar de filtro volta para a primeira página.
export default async function ExploreFilterBar({ styles, filters, locale }: IProps) {
    const [t, tTypes] = await Promise.all([
        getTranslations({ locale, namespace: 'explorePage.filterBar' }),
        getTranslations({ locale, namespace: 'quizTypes' }),
    ])

    const hrefWith = (changes: Partial<IExploreFilters>) => exploreHref({ ...filters, ...changes, page: 1 })

    return (
        <div className={styles.filter_bar}>
            <nav className={styles.filter_group} aria-label={t('languages')}>
                {EXPLORE_LANGS.map(lang => {
                    const active = filters.lang === lang,
                        name = t('langLabel', { language: LANG_NAMES[lang] })
                    return (
                        <ExploreFilterLink
                            key={lang}
                            styles={styles}
                            href={hrefWith({ lang: active ? undefined : lang })}
                            active={active}
                            label={active ? t('remove', { filter: name }) : name}
                            className={styles.filter_lang}
                        >
                            {lang.toUpperCase()}
                        </ExploreFilterLink>
                    )
                })}
            </nav>

            <nav className={styles.filter_group} aria-label={t('types')}>
                {EXPLORE_TYPE_SLUGS.map(type => {
                    const Icon = TYPE_ICONS[type],
                        active = filters.type === type,
                        name = tTypes(TYPE_NAMES[type])
                    return (
                        <ExploreFilterLink
                            key={type}
                            styles={styles}
                            href={hrefWith({ type: active ? undefined : type })}
                            active={active}
                            label={active ? t('remove', { filter: name }) : name}
                            className={styles.filter_type}
                        >
                            <Icon aria-hidden="true" />
                        </ExploreFilterLink>
                    )
                })}
            </nav>
        </div>
    )
}
