import fs from 'node:fs'
import path from 'node:path'
import { marked } from 'marked'
import { QuizKind } from '@/utils/quizKind'

// Blog: cada artigo é um arquivo Markdown em src/content/blog/<idioma>/<slug>.md, revisado
// por commit/PR como o resto do código. O cabeçalho (entre ---) traz título, descrição,
// autoria, datas e o status: "draft" (rascunho) ou "published".

export interface IBlogPostMeta {
    slug: string
    locale: string
    title: string
    description: string
    author: string
    publishedAt: string
    // só quando houve revisão de verdade no conteúdo
    updatedAt?: string
    status: 'draft' | 'published'
    // tipo de quiz da chamada no fim do artigo
    cta: QuizKind
    readingMinutes: number
}

export interface IBlogPost extends IBlogPostMeta {
    html: string
}

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog')
const CTA_KINDS: QuizKind[] = ['quiz', 'exam', 'aboutMe', 'personality']
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// Rascunho só aparece fora de produção, para revisar no ambiente de desenvolvimento.
// Em produção ele não é listado, não entra no sitemap e a página responde 404.
export const showDrafts = process.env.NODE_ENV !== 'production'

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

function readPost(locale: string, slug: string): IBlogPost | null {
    if (!SLUG.test(slug) || !/^[a-z]{2}$/.test(locale)) return null

    const file = path.join(BLOG_DIR, locale, `${slug}.md`)
    if (!fs.existsSync(file)) return null

    const { data, body } = parseFrontmatter(fs.readFileSync(file, 'utf8'))
    if (!data.title || !data.description || !data.publishedAt) return null

    const words = body.split(/\s+/).filter(Boolean).length

    return {
        slug,
        locale,
        title: data.title,
        description: data.description,
        author: data.author || 'Equipe QuestioFlux',
        publishedAt: data.publishedAt,
        ...(data.updatedAt ? { updatedAt: data.updatedAt } : {}),
        status: data.status === 'published' ? 'published' : 'draft',
        cta: CTA_KINDS.includes(data.cta as QuizKind) ? data.cta as QuizKind : 'quiz',
        readingMinutes: Math.max(1, Math.round(words / 200)),
        html: marked.parse(body, { async: false, gfm: true }) as string,
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
        .map(({ html, ...meta }) => meta)
        .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
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
