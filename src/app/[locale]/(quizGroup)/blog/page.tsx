import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getPosts } from '@/utils/blog'
import { SITE_URL } from '@/utils/seo'
import { routing } from '@/i18n/routing'
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
            languages: Object.fromEntries(localesWithPosts().map(item => [item, `${SITE_URL}/${item}/blog`])),
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

    return (
        <div className={styles.blog}>
            <header className={styles.blog_header}>
                <h1>{t('title')}</h1>
                <p>{t('subtitle')}</p>
            </header>

            {posts.length === 0 && <p className={styles.empty}>{t('empty')}</p>}

            <ul className={styles.post_list}>
                {posts.map(post => (
                    <li key={post.slug}>
                        <Link href={`/blog/${post.slug}`} locale={locale} className={styles.post_card}>
                            {post.status === 'draft' && <span className={styles.draft_badge}>{t('draft')}</span>}
                            <h2>{post.title}</h2>
                            <p>{post.description}</p>
                            <span className={styles.post_meta}>
                                <time dateTime={post.publishedAt}>{dateFormat.format(new Date(post.publishedAt))}</time>
                                {' · '}{t('readingTime', { minutes: post.readingMinutes })}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
