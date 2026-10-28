import fs from 'node:fs'
import path from 'node:path'
import { Marked } from 'marked'
import { QuizKind } from '@/utils/quizKind'

// Blog: cada artigo é um arquivo Markdown em src/content/blog/<idioma>/<slug>.md, revisado
// por commit/PR como o resto do código. O cabeçalho (entre ---) traz título, descrição,
// autoria, datas e o status: "draft" (rascunho) ou "published".
// O slug é em inglês e igual em todos os idiomas: a tradução é o mesmo arquivo na pasta
// do outro idioma, e trocar o idioma no site mantém o mesmo endereço.

export interface IBlogPostMeta {
    slug: string
    locale: string
    title: string
    description: string
    // etiqueta do card (Tutorial, Comparativo...)
    tag: string
    author: string
    publishedAt: string
    // só quando houve revisão de verdade no conteúdo
    updatedAt?: string
    status: 'draft' | 'published'
    // tipo de quiz da chamada no fim do artigo (e da capa)
    cta: QuizKind
    readingMinutes: number
}

export interface IBlogPost extends IBlogPostMeta {
    html: string
    // títulos das seções, para o "Neste artigo"
    toc: Array<{ id: string, text: string }>
}

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog')
const CTA_KINDS: QuizKind[] = ['quiz', 'exam', 'aboutMe', 'personality']
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// Rascunho só aparece fora de produção, para revisar no ambiente de desenvolvimento.
// Em produção ele não é listado, não entra no sitemap e a página responde 404.
export const showDrafts = process.env.NODE_ENV !== 'production'

// id da seção a partir do título (acentos fora; chinês e outras letras ficam)
export const headingId = (text: string) => text
    .replace(/<[^>]+>/g, '')
    .replace(/[*_`[\]()]/g, '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')

const markdown = new Marked({
    gfm: true,
    renderer: {
        // as seções (##) ganham id para o sumário apontar para elas
        heading({ tokens, depth, text }) {
            const inner = this.parser.parseInline(tokens)
            return depth === 2
                ? `<h2 id="${headingId(text)}">${inner}</h2>\n`
                : `<h${depth}>${inner}</h${depth}>\n`
        },
    },
})

function parseFrontmatter(raw: string): { data: Record<string, string>, body: string } {
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
    if (!match) return { data: {}, body: raw }

    const data: Record<string, string> = {}
    for (const line of match[1].split(/\r?\n/)) {
        const separator = line.indexOf(':')
        if (separator < 1) continue
        data[line.slice(0, separator).trim()] = line.slice(separator + 1).trim().replace(/^["']|["']$/g, '')
    }
    return { data, body: match[2] }
}

// palavras para o tempo de leitura; em chinês conta por caractere (~400 por minuto)
function readingMinutes(body: string, locale: string): number {
    if (locale === 'zh') return Math.max(1, Math.round(body.replace(/\s+/g, '').length / 400))
    return Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 200))
}

function readPost(locale: string, slug: string): IBlogPost | null {
    if (!SLUG.test(slug) || !/^[a-z]{2}$/.test(locale)) return null

    const file = path.join(BLOG_DIR, locale, `${slug}.md`)
    if (!fs.existsSync(file)) return null

    const { data, body } = parseFrontmatter(fs.readFileSync(file, 'utf8'))
    if (!data.title || !data.description || !data.publishedAt) return null

    const html = (markdown.parse(body, { async: false }) as string)
        // a tabela rola de lado dentro da própria caixa no celular
        .replace(/<table>/g, '<div data-table><table>')
        .replace(/<\/table>/g, '</table></div>')

    const toc = markdown.lexer(body)
        .filter(token => token.type === 'heading' && token.depth === 2)
        .map(token => ({ id: headingId((token as { text: string }).text), text: (token as { text: string }).text.replace(/[*_`]/g, '') }))

    return {
        slug,
        locale,
        title: data.title,
        description: data.description,
        tag: data.tag || '',
        author: data.author || 'QuestioFlux',
        publishedAt: data.publishedAt,
        ...(data.updatedAt ? { updatedAt: data.updatedAt } : {}),
        status: data.status === 'published' ? 'published' : 'draft',
        cta: CTA_KINDS.includes(data.cta as QuizKind) ? data.cta as QuizKind : 'quiz',
        readingMinutes: readingMinutes(body, locale),
        html,
        toc,
    }
}

const visible = (post: IBlogPostMeta | null, includeDrafts: boolean): post is IBlogPostMeta =>
    !!post && (post.status === 'published' || includeDrafts)

// Artigos de um idioma, do mais novo para o mais antigo
export function getPosts(locale: string, includeDrafts = showDrafts): IBlogPostMeta[] {
    const dir = path.join(BLOG_DIR, locale)
    if (!/^[a-z]{2}$/.test(locale) || !fs.existsSync(dir)) return []

    return fs.readdirSync(dir)
        .filter(file => file.endsWith('.md'))
        .map(file => readPost(locale, file.replace(/\.md$/, '')))
        .filter((post): post is IBlogPost => visible(post, includeDrafts))
        .map(({ html, toc, ...meta }) => meta)
        .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug))
}

export function getPost(locale: string, slug: string, includeDrafts = showDrafts): IBlogPost | null {
    const post = readPost(locale, slug)
    return visible(post, includeDrafts) ? post as IBlogPost : null
}

// Publicados em todos os idiomas (sitemap e páginas estáticas)
export function getAllPublishedPosts(): IBlogPostMeta[] {
    if (!fs.existsSync(BLOG_DIR)) return []
    return fs.readdirSync(BLOG_DIR).flatMap(locale => getPosts(locale, false))
}

// O mesmo artigo (mesmo slug) nos idiomas em que está publicado (hreflang)
export function getTranslationsOf(slug: string): IBlogPostMeta[] {
    return getAllPublishedPosts().filter(post => post.slug === slug)
}
