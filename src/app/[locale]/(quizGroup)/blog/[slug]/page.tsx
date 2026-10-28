import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getAllPublishedPosts, getPost } from '@/utils/blog'
import { SITE_URL } from '@/utils/seo'
import { quizKindSlug } from '@/utils/quizKind'
import BlogCta from '@/components/Blog/blog-cta'
import styles from '../blog.module.scss'

interface IProps {
    params: Promise<{ locale: string, slug: string }>
}

// os publicados saem prontos do build; rascunho nunca entra aqui
export function generateStaticParams() {
    return getAllPublishedPosts().map(post => ({ locale: post.locale, slug: post.slug }))
}

// o mesmo artigo em outros idiomas tem o mesmo slug
const translations = (slug: string) =>
    getAllPublishedPosts().filter(post => post.slug === slug)

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const { locale, slug } = await params
    const post = getPost(locale, slug)
    if (!post) return {}

    const url = `${SITE_URL}/${locale}/blog/${slug}`
    return {
        title: `${post.title} | QuestioFlux`,
        description: post.description,
        robots: post.status === 'published' ? 'index, follow' : 'noindex, nofollow',
        authors: [{ name: post.author }],
        alternates: {
            canonical: url,
            languages: Object.fromEntries(translations(slug).map(item => [item.locale, `${SITE_URL}/${item.locale}/blog/${slug}`])),
        },
        openGraph: {
            title: post.title,
            description: post.description,
            url,
            siteName: 'QuestioFlux',
            type: 'article',
            publishedTime: post.publishedAt,
            ...(post.updatedAt ? { modifiedTime: post.updatedAt } : {}),
            authors: [post.author],
        },
        twitter: { card: 'summary', title: post.title, description: post.description },
    }
}

export default async function BlogPostPage({ params }: IProps) {
    const { locale, slug } = await params
    const post = getPost(locale, slug)
    if (!post) notFound()

    const t = await getTranslations({ locale, namespace: 'blogPage' })
    const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' })

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt ?? post.publishedAt,
        inLanguage: locale,
        author: { '@type': 'Organization', name: post.author, url: SITE_URL },
        publisher: { '@type': 'Organization', name: 'QuestioFlux', url: SITE_URL },
        mainEntityOfPage: `${SITE_URL}/${locale}/blog/${slug}`,
    }

    return (
        <article className={styles.article}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

            <nav className={styles.breadcrumb}>
                <Link href="/blog" locale={locale}>{t('backToBlog')}</Link>
            </nav>

            {post.status === 'draft' && <p className={styles.draft_notice}>{t('draftNotice')}</p>}

            <header className={styles.article_header}>
                <h1>{post.title}</h1>
                <p className={styles.lead}>{post.description}</p>
                <p className={styles.post_meta}>
                    {t('byline', { author: post.author })}{' · '}
                    {t('publishedOn')} <time dateTime={post.publishedAt}>{dateFormat.format(new Date(post.publishedAt))}</time>
                    {post.updatedAt && <>{' · '}{t('updatedOn')} <time dateTime={post.updatedAt}>{dateFormat.format(new Date(post.updatedAt))}</time></>}
                    {' · '}{t('readingTime', { minutes: post.readingMinutes })}
                </p>
            </header>

            {/* conteúdo do próprio repositório (revisado como código), não de quem usa o site */}
            <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.html }} />

            <BlogCta slug={slug} href={`/create/quiz/${quizKindSlug(post.cta)}`} kind={post.cta} />
        </article>
    )
}
