import { getApiTypeQuiz } from './quizTypeFilter'
import { CONTENT_LANGUAGES, contentLanguageBase } from './contentLanguages'

// Filtros do Explorar, todos no endereço (?type=personality&lang=pt&page=2): o servidor monta
// a lista filtrada, o link pode ser compartilhado e o Google segue as páginas.

// Idioma do conteúdo pelo código curto (?lang=fr acha FR-FR). Os idiomas da interface ficam
// sempre à mostra no filtro; os outros, em "Mais idiomas".
export const EXPLORE_MAIN_LANGS = ['en', 'pt', 'es', 'zh'] as const
export const EXPLORE_LANGS: readonly string[] = Array.from(new Set(CONTENT_LANGUAGES.map(language => contentLanguageBase(language.code))))
export type ExploreLang = string

// cada idioma na própria língua, como no seletor de idioma do site
export const exploreLangName = (lang: string): string =>
    CONTENT_LANGUAGES.find(language => contentLanguageBase(language.code) === lang)?.name ?? lang.toUpperCase()

// tipos do filtro rápido, na ordem da tela: slug no endereço -> typeQuiz da busca no backend
export const EXPLORE_TYPES = {
    'questions-and-answers': 'quiz',
    'exam': 'exam',
    'about-me': 'aboutMe',
    'personality': 'personality',
    // formatos interativos: o slug é o próprio tipo
    'tournament': 'tournament',
    'story': 'story',
    'compatibility': 'compatibility',
    'scored': 'scored',
    'image': 'image/RW',
} as const
export type ExploreType = keyof typeof EXPLORE_TYPES
export const EXPLORE_TYPE_SLUGS = Object.keys(EXPLORE_TYPES) as ExploreType[]

export interface IExploreFilters {
    title?: string
    tags?: string
    categories?: string
    type?: ExploreType
    lang?: ExploreLang
    page: number
}

type TParams = Record<string, string | string[] | undefined> | URLSearchParams

const read = (params: TParams | undefined, key: string): string | undefined => {
    if (!params) return undefined
    const value = params instanceof URLSearchParams ? params.get(key) : params[key]
    const first = Array.isArray(value) ? value[0] : value
    return first?.trim() || undefined
}

const isExploreType = (value: unknown): value is ExploreType =>
    typeof value === 'string' && value in EXPLORE_TYPES

const isExploreLang = (value: unknown): value is ExploreLang =>
    typeof value === 'string' && EXPLORE_LANGS.includes(value)

// links antigos usavam ?typeQuiz=Personality (ou personality, image/RW...)
const typeFromLegacy = (value?: string): ExploreType | undefined => {
    const api = getApiTypeQuiz(value)
    return EXPLORE_TYPE_SLUGS.find(slug => EXPLORE_TYPES[slug] === api)
}

export function parseExploreFilters(params?: TParams): IExploreFilters {
    const type = read(params, 'type'),
        lang = read(params, 'lang')?.toLowerCase(),
        page = Number(read(params, 'page'))

    return {
        title: read(params, 'title'),
        tags: read(params, 'tags'),
        categories: read(params, 'categories'),
        type: isExploreType(type) ? type : typeFromLegacy(read(params, 'typeQuiz')),
        lang: isExploreLang(lang) ? lang : undefined,
        page: Number.isInteger(page) && page > 1 ? page : 1,
    }
}

// algum filtro além da página: a lista vem da busca, não da lista geral
export const hasExploreSearch = (filters: IExploreFilters) =>
    Boolean(filters.title || filters.tags || filters.categories || filters.type || filters.lang)

// Endereço do Explorar com os filtros, sempre na mesma ordem (um endereço por combinação)
export function exploreHref(filters: Partial<IExploreFilters>): string {
    const params = new URLSearchParams()
    if (filters.title) params.set('title', filters.title)
    if (filters.tags) params.set('tags', filters.tags)
    if (filters.categories) params.set('categories', filters.categories)
    if (filters.type) params.set('type', filters.type)
    if (filters.lang) params.set('lang', filters.lang)
    if (filters.page && filters.page > 1) params.set('page', String(filters.page))
    const query = params.toString()
    return query ? `/explore?${query}` : '/explore'
}

// Parâmetros da busca no backend (/api/quizzes/search ou /api/quizzes/public)
export function exploreApiPath(filters: IExploreFilters, page = filters.page): string {
    if (!hasExploreSearch(filters)) return `/api/quizzes/public?page=${page}`

    const params = new URLSearchParams()
    params.set('page', String(page))
    if (filters.title) params.set('title', filters.title)
    if (filters.tags) params.set('tags', filters.tags)
    if (filters.categories) params.set('categories', filters.categories)
    if (filters.type) params.set('typeQuiz', EXPLORE_TYPES[filters.type])
    if (filters.lang) params.set('lang', filters.lang)
    return `/api/quizzes/search?${params.toString()}`
}
