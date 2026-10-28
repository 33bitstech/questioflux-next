import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { ArrowLeft } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getAllPublishedPosts, getPost, getPosts, getTranslationsOf } from '@/utils/blog'
import { hreflangMap, SITE_URL } from '@/utils/seo'
import { quizKindSlug } from '@/utils/quizKind'
import BlogCta from '@/components/Blog/blog-cta'
import BlogCover from '@/components/Blog/blog-cover'
import styles from '../blog.module.scss'

interface IProps {
    params: Promise<{ locale: string, slug: string }>
}

// os publicados saem prontos do build; rascunho nunca entra aqui
export function generateStaticParams() {
    return getAllPublishedPosts().map(post => ({ locale: post.locale, slug: post.slug }))
}

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
            languages: hreflangMap(getTranslationsOf(post.key).map(item => ({ locale: item.locale, url: `${SITE_URL}/${item.locale}/blog/${item.slug}` }))),
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
    const related = getPosts(locale).filter(item => item.slug !== slug).slice(0, 2)

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

            {/* div, não nav/header: o layout do site posiciona essas tags como a barra do topo */}
            <div className={styles.breadcrumb}>
                <Link href="/blog" locale={locale}><ArrowLeft aria-hidden="true" /> {t('backToBlog')}</Link>
            </div>

            {post.status === 'draft' && <p className={styles.draft_notice}>{t('draftNotice')}</p>}

            <div className={styles.article_hero}>
                <div className={styles.tags}>
                    {post.tag && <span className={styles.tag}>{post.tag}</span>}
                    <span className={styles.post_meta}>{t('readingTime', { minutes: post.readingMinutes })}</span>
                </div>
                <h1>{post.title}</h1>
                <p className={styles.lead}>{post.description}</p>
                <div className={styles.byline}>
                    <span className={styles.avatar} aria-hidden="true">Q</span>
                    <div>
                        <strong>{post.author}</strong>
                        <span>
                            {t('publishedOn')} <time dateTime={post.publishedAt}>{dateFormat.format(new Date(post.publishedAt))}</time>
                            {post.updatedAt && <>{' · '}{t('updatedOn')} <time dateTime={post.updatedAt}>{dateFormat.format(new Date(post.updatedAt))}</time></>}
                        </span>
                    </div>
                </div>
            </div>

            <BlogCover kind={post.cta} size="hero" />

            <div className={styles.article_layout}>
                {post.toc.length > 2 && (
                    <aside className={styles.toc} aria-label={t('inThisArticle')}>
                        <p>{t('inThisArticle')}</p>
                        <ol>
                            {post.toc.map(item => <li key={item.id}><a href={`#${item.id}`}>{item.text}</a></li>)}
                        </ol>
                    </aside>
                )}

                <div className={styles.article_main}>
                    {/* conteúdo do próprio repositório (revisado como código), não de quem usa o site */}
                    <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.html }} />
                    <BlogCta slug={slug} href={`/create/quiz/${quizKindSlug(post.cta)}`} kind={post.cta} />
                </div>
            </div>

            {related.length > 0 && (
                <section className={styles.related}>
                    <h2>{t('related')}</h2>
                    <div className={styles.post_grid}>
                        {related.map(item => (
                            <div key={item.slug} className={styles.post_card}>
                                <Link href={`/blog/${item.slug}`} locale={locale}>
                                    <BlogCover kind={item.cta} />
                                    <div className={styles.card_body}>
                                        {item.tag && <div className={styles.tags}><span className={styles.tag}>{item.tag}</span></div>}
                                        <h3>{item.title}</h3>
                                        <span className={styles.post_meta}>{t('readingTime', { minutes: item.readingMinutes })}</span>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </article>
    )
}
