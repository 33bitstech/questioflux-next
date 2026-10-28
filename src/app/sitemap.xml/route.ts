import { routing } from '@/i18n/routing'
import { getIndexableQuizzes } from '@/utils/publicQuiz'
import { quizTypeSlugs } from '@/utils/quizKind'
import { quizCanonicalUrl, shellLanguages, SITE_URL } from '@/utils/seo'
import { getAllPublishedPosts } from '@/utils/blog'

// Gerado no servidor e guardado por uma hora.
export const dynamic = 'force-static'
export const revalidate = 3600

// Páginas que existem nos 3 idiomas. Nada com noindex entra aqui.
const SHELL_PATHS = [
    '', '/explore', '/create/quiz', '/about-us',
    ...Object.keys(quizTypeSlugs).map(slug => `/create/quiz/${slug}`),
]

interface IEntry {
    loc: string
    lastmod?: string
    alternates?: Record<string, string>
    images?: string[]
}

const escapeXml = (value: string) => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const validDate = (value: string) => {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

// O XML é montado aqui, e não pelo sitemap.ts do Next, por causa da ordem das tags: o
// schema do sitemaps.org pede loc, lastmod e só depois as extensões (hreflang, imagens).
// O Next põe o lastmod por último, o que o Google aceita mas validadores acusam.
function urlTag({ loc, lastmod, alternates = {}, images = [] }: IEntry) {
    return [
        '<url>',
        `<loc>${escapeXml(loc)}</loc>`,
        ...(lastmod ? [`<lastmod>${lastmod}</lastmod>`] : []),
        ...Object.entries(alternates).map(([lang, href]) =>
            `<xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(href)}" />`),
        ...images.map(src => `<image:image><image:loc>${escapeXml(src)}</image:loc></image:image>`),
        '</url>',
    ].join('\n')
}

// Só artigos publicados (rascunho nunca entra) e a listagem dos idiomas que têm artigo
function blogEntries(): IEntry[] {
    const posts = getAllPublishedPosts()
    const locales = Array.from(new Set(posts.map(post => post.locale)))
    const listingAlternates = Object.fromEntries(locales.map(locale => [locale, `${SITE_URL}/${locale}/blog`]))

    return [
        ...locales.map(locale => ({ loc: `${SITE_URL}/${locale}/blog`, alternates: listingAlternates })),
        ...posts.map(post => ({
            loc: `${SITE_URL}/${post.locale}/blog/${post.slug}`,
            lastmod: validDate(post.updatedAt ?? post.publishedAt),
            alternates: Object.fromEntries(posts.filter(item => item.slug === post.slug)
                .map(item => [item.locale, `${SITE_URL}/${item.locale}/blog/${item.slug}`])),
        })),
    ]
}

async function getEntries(): Promise<IEntry[]> {
    const shell: IEntry[] = [
        ...SHELL_PATHS.flatMap(path =>
            routing.locales.map(locale => ({
                loc: `${SITE_URL}/${locale}${path}`,
                alternates: shellLanguages(path),
            }))
        ),
        ...blogEntries(),
    ]

    try {
        // Uma URL por quiz: a canônica. Só entra o que a página serve como "index".
        const quizzes: IEntry[] = (await getIndexableQuizzes()).map(quiz => ({
            loc: quizCanonicalUrl(quiz),
            lastmod: validDate(quiz.updated_at),
            images: quiz.images,
        }))

        return [...shell, ...quizzes]
    } catch (err) {
        // Em produção, estourar faz o Next continuar servindo o último sitemap bom em vez
        // de trocar por um sem quizzes. No build e em dev não há versão anterior: sai só
        // com as páginas fixas.
        const hasPreviousVersion =
            process.env.NODE_ENV === 'production' &&
            process.env.NEXT_PHASE !== 'phase-production-build'

        if (hasPreviousVersion) throw err

        console.error(err)
        return shell
    }
}

export async function GET() {
    const entries = await getEntries()

    const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
        ...entries.map(urlTag),
        '</urlset>',
        '',
    ].join('\n')

    return new Response(xml, { headers: { 'Content-Type': 'application/xml' } })
}
