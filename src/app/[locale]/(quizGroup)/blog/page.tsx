import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getPosts, IBlogPostMeta } from '@/utils/blog'
import { hreflangMap, SITE_URL } from '@/utils/seo'
import { routing } from '@/i18n/routing'
import BlogCover from '@/components/Blog/blog-cover'
import styles from './blog.module.scss'

interface IProps {
    params: Promise<{ locale: string }>
}

// idiomas que têm artigo: só eles entram como alternativos e no sitemap
const localesWithPosts = () => routing.locales.filter(locale => getPosts(locale, false).length > 0)

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'blogPage' })
    const hasPosts = getPosts(locale, false).length > 0

    return {
        title: t('metadataTitle'),
        description: t('metadataDescription'),
        // sem artigo neste idioma a página fica fora do Google
        robots: hasPosts ? 'index, follow' : 'noindex, follow',
        alternates: {
            canonical: `${SITE_URL}/${locale}/blog`,
            languages: hreflangMap(localesWithPosts().map(item => ({ locale: item, url: `${SITE_URL}/${item}/blog` }))),
        },
        openGraph: {
            title: t('metadataTitle'),
            description: t('metadataDescription'),
            url: `${SITE_URL}/${locale}/blog`,
            siteName: 'QuestioFlux',
            type: 'website',
        },
    }
}

export default async function BlogPage({ params }: IProps) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'blogPage' })
    const posts = getPosts(locale)
    const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' })
    const [featured, ...others] = posts

    const meta = (post: IBlogPostMeta) => (
        <span className={styles.post_meta}>
            <time dateTime={post.publishedAt}>{dateFormat.format(new Date(post.publishedAt))}</time>
            <span aria-hidden="true">·</span>
            {t('readingTime', { minutes: post.readingMinutes })}
        </span>
    )

    return (
        <div className={styles.blog}>
            {/* div, não header: o layout do site posiciona todo <header> como a barra do topo */}
            <div className={styles.blog_hero}>
                <span className={styles.eyebrow}>{t('title')}</span>
                <h1>{t('heroTitle')}</h1>
                <p>{t('subtitle')}</p>
            </div>

            {posts.length === 0 && <p className={styles.empty}>{t('empty')}</p>}

            {featured && (
                <article className={styles.featured}>
                    <Link href={`/blog/${featured.slug}`} locale={locale}>
                        <BlogCover kind={featured.cta} size="featured" />
                        <div className={styles.featured_body}>
                            <div className={styles.tags}>
                                {featured.tag && <span className={styles.tag}>{featured.tag}</span>}
                                {featured.status === 'draft' && <span className={styles.draft_badge}>{t('draft')}</span>}
                            </div>
                            <h2>{featured.title}</h2>
                            <p>{featured.description}</p>
                            {meta(featured)}
                            <span className={styles.read_more}>{t('readArticle')} <ArrowRight aria-hidden="true" /></span>
                        </div>
                    </Link>
                </article>
            )}

            {others.length > 0 && (
                <div className={styles.post_grid}>
                    {others.map(post => (
                        <article key={post.slug} className={styles.post_card}>
                            <Link href={`/blog/${post.slug}`} locale={locale}>
                                <BlogCover kind={post.cta} />
                                <div className={styles.card_body}>
                                    <div className={styles.tags}>
                                        {post.tag && <span className={styles.tag}>{post.tag}</span>}
                                        {post.status === 'draft' && <span className={styles.draft_badge}>{t('draft')}</span>}
                                    </div>
                                    <h2>{post.title}</h2>
                                    <p>{post.description}</p>
                                    {meta(post)}
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>
            )}
        </div>
    )
}
