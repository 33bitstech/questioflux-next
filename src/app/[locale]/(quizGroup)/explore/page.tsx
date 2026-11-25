import styles from './explore.module.scss'
import ContextualHeaderActions from '@/components/NavigateWidgets/contextual-header-action'
import SearchResults from '@/components/Searching/search-results'
import FeaturedsContainer from '@/components/Searching/featureds-container'
import ExploreFilterBar from '@/components/Searching/explore-filter-bar'
import { env } from '@/env'
import { generateExploreQuizSchema } from '@/utils/generateSchemas'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { cache } from 'react'
import GoogleAd from '@/components/Google/GoogleAd'
import { getQuizzes, getFeaturedsQuizzes } from './actions'
import { getOpenGraphLocale } from '@/utils/locale'
import { jsonLd } from '@/utils/seo'
import { exploreHref, exploreLangName, hasExploreSearch, IExploreFilters, parseExploreFilters } from '@/utils/exploreFilters'

type TSearchParams = Record<string, string | string[] | undefined>

interface IProps {
    params: Promise<{ locale: string }>
    searchParams?: Promise<TSearchParams>
}

const QUIZ_TYPE_NAMES = {
    'questions-and-answers': 'names.quiz',
    'exam': 'names.exam',
    'about-me': 'names.aboutMe',
    'personality': 'names.personality',
    'tournament': 'names.tournament',
    'story': 'names.story',
    'compatibility': 'names.compatibility',
    'scored': 'names.scored',
    'image': 'image',
} as const

// Só tipo, idioma e página formam páginas próprias para o Google; busca por texto, tags e
// categorias continuam acessíveis, mas fora do índice
const isIndexable = (filters: IExploreFilters) => !filters.title && !filters.tags && !filters.categories

// a mesma busca serve ao generateMetadata e à página: uma chamada por requisição
const loadQuizzes = cache((filtersKey: string) => getQuizzes(JSON.parse(filtersKey) as IExploreFilters))

export async function generateMetadata({ params, searchParams }: IProps): Promise<Metadata> {
    const { locale } = await params
    const filters = parseExploreFilters(await searchParams)
    // um filtro ainda sem nenhum quiz (um tipo novo, uma página depois da última) fica fora do
    // índice até ter conteúdo; o Explorar sem filtros continua sempre no índice. Se a busca
    // falhar, vale só a regra dos filtros.
    const narrowed = Boolean(filters.type || filters.lang || filters.page > 1)
    const [t, tTypes, listing] = await Promise.all([
        getTranslations({ locale, namespace: 'explorePage' }),
        getTranslations({ locale, namespace: 'quizTypes' }),
        narrowed ? loadQuizzes(JSON.stringify(filters)) : Promise.resolve(undefined),
    ])
    const emptyListing = Array.isArray(listing?.quizzes) && listing.quizzes.length === 0

    // o endereço canônico guarda só os filtros que formam a página (na ordem fixa)
    const path = exploreHref({ type: filters.type, lang: filters.lang, page: filters.page })
    const url = (lang: string) => `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${lang}${path}`

    const labels = [
        filters.type ? tTypes(QUIZ_TYPE_NAMES[filters.type]) : '',
        filters.lang ? exploreLangName(filters.lang) : '',
    ].filter(Boolean).join(' · ')
    const page = filters.page > 1 ? ` – ${t('metadataPage', { page: filters.page })}` : ''
    const title = (labels ? t('metadataFiltered', { filters: labels }) : t('metadataTitle')) + page

    return {
        title,
        description: t('metadataDesc'),
        robots: isIndexable(filters) && !emptyListing ? 'index, follow' : 'noindex, follow',
        keywords: "quiz, explore, play",
        alternates: {
            canonical: url(locale),
            languages: {
                'es': url('es'),
                'en-US': url('en'),
                'pt-BR': url('pt'),
                'zh-CN': url('zh'),
                'x-default': url('en'),
            }
        },
        openGraph: {
            title,
            description: t('metadataDesc'),
            url: url(locale),
            siteName: 'QuestioFlux',
            images: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/quiz_padrao_preto.png`,
            locale: getOpenGraphLocale(locale),
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: t('metadataDesc'),
            images: [`${env.NEXT_PUBLIC_DOMAIN_FRONT}/quiz_padrao_preto.png`],
        }
    }
}

export default async function Explore({ params, searchParams }: IProps) {
    const { locale } = await params;
    const filters = parseExploreFilters(await searchParams)
    // sem filtro nem busca, na primeira página: os mais populares aparecem em cima
    const showFeatured = !hasExploreSearch(filters) && filters.page === 1

    const [t, paginatedData, popularQuizzes] = await Promise.all([
        getTranslations({ locale, namespace: 'explorePage' }),
        loadQuizzes(JSON.stringify(filters)),
        showFeatured ? getFeaturedsQuizzes() : Promise.resolve(undefined),
    ])

    const quizzes = paginatedData?.quizzes ?? []
    const totalPages = paginatedData?.totalPages ?? 1
    const total = paginatedData?.total ?? quizzes.length
    const baseUrl = `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}`;
    const firstPosition = (filters.page - 1) * 18

    const itemListSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'name': t('metadataTitle'),
        'description': t('metadataDesc'),
        'numberOfItems': total,
        'itemListElement': quizzes.map((quiz, index) => ({
            '@type': 'ListItem',
            'position': firstPosition + index + 1,
            'item': generateExploreQuizSchema(quiz, baseUrl, env.NEXT_PUBLIC_DOMAIN_FRONT)
        })),
    };

    return (
        <main className={styles.content}>
            <nav className={styles.div_buttons_links}>
                <ContextualHeaderActions page='explore' locale={locale} />
            </nav>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: jsonLd(itemListSchema) }}
            />

            {showFeatured && <FeaturedsContainer styles={styles} defaultQuizzes={popularQuizzes ?? []} />}

            <GoogleAd slot='9817632261' />

            <section className={styles.results}>
                <h1 className={styles.main_title}>{t('mainTitle')}</h1>
                <ExploreFilterBar styles={styles} filters={filters} locale={locale} />
                <SearchResults
                    styles={styles}
                    defaultQuizzes={quizzes}
                    filters={filters}
                    totalPages={totalPages}
                />
            </section>
            <GoogleAd slot='3850989716' />
        </main>
    )
}
