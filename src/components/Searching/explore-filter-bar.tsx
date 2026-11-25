import { getTranslations } from 'next-intl/server'
import { ImageIcon, LucideIcon } from 'lucide-react'
import { QUIZ_KIND_ICONS } from '@/components/QuizTypes/quiz-type-icon'
import ExploreFilterLink from './explore-filter-link'
import { TStyles } from '@/types/stylesType'
import {
    EXPLORE_LANGS, EXPLORE_MAIN_LANGS, EXPLORE_TYPE_SLUGS, exploreHref, exploreLangName, ExploreType, IExploreFilters,
} from '@/utils/exploreFilters'

interface IProps {
    styles: TStyles
    filters: IExploreFilters
    locale: string
}

// os mesmos ícones das páginas de criação
const TYPE_ICONS: Record<ExploreType, LucideIcon> = {
    'questions-and-answers': QUIZ_KIND_ICONS.quiz,
    'exam': QUIZ_KIND_ICONS.exam,
    'about-me': QUIZ_KIND_ICONS.aboutMe,
    'personality': QUIZ_KIND_ICONS.personality,
    'tournament': QUIZ_KIND_ICONS.tournament,
    'story': QUIZ_KIND_ICONS.story,
    'compatibility': QUIZ_KIND_ICONS.compatibility,
    'scored': QUIZ_KIND_ICONS.scored,
    'image': ImageIcon,
}

// chave em quizTypes
const TYPE_NAMES: Record<ExploreType, string> = {
    'questions-and-answers': 'names.quiz',
    'exam': 'names.exam',
    'about-me': 'names.aboutMe',
    'personality': 'names.personality',
    'tournament': 'names.tournament',
    'story': 'names.story',
    'compatibility': 'names.compatibility',
    'scored': 'names.scored',
    'image': 'image',
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
                {/* os idiomas da interface, mais o idioma ativo quando é um dos outros */}
                {[...EXPLORE_MAIN_LANGS, ...(filters.lang && !(EXPLORE_MAIN_LANGS as readonly string[]).includes(filters.lang) ? [filters.lang] : [])].map(lang => {
                    const active = filters.lang === lang,
                        name = t('langLabel', { language: exploreLangName(lang) })
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
                {/* links comuns (funcionam sem JavaScript e o Google segue) */}
                <details className={styles.filter_more}>
                    <summary>{t('moreLanguages')}</summary>
                    <ul>
                        {EXPLORE_LANGS.filter(lang => !(EXPLORE_MAIN_LANGS as readonly string[]).includes(lang)).map(lang => (
                            <li key={lang}>
                                <ExploreFilterLink
                                    styles={styles}
                                    href={hrefWith({ lang: filters.lang === lang ? undefined : lang })}
                                    active={filters.lang === lang}
                                    label={t('langLabel', { language: exploreLangName(lang) })}
                                    className={styles.filter_more_link}
                                >
                                    {exploreLangName(lang)}
                                </ExploreFilterLink>
                            </li>
                        ))}
                    </ul>
                </details>
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
