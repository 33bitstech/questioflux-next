import styles from '../quiz/[quizType]/quiz-type.module.scss'
import own from './experiences-page.module.scss'
import { Link } from '@/i18n/navigation'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ArrowRight, Check } from 'lucide-react'
import QuizTypeIcon from '@/components/QuizTypes/quiz-type-icon'
import ExperiencePreview from '@/components/Experiences/experience-preview'
import { getOpenGraphLocale } from '@/utils/locale'
import { experienceKinds } from '@/utils/quizKind'
import { DEFAULT_QUIZ_IMAGE, jsonLd, shellLanguages, SITE_URL } from '@/utils/seo'

interface IProps {
    params: Promise<{ locale: string }>
}

interface IFaq { question: string, answer: string }

const LANGUAGE_TAGS: Record<string, string> = { pt: 'pt-BR', en: 'en-US', es: 'es', zh: 'zh-CN' }
const PATH = '/create/experiences'

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'experiencePages.index.metadata' })
    const url = `${SITE_URL}/${locale}${PATH}`
    const title = t('title')
    const description = t('desc')

    return {
        title,
        description,
        robots: { index: true, follow: true },
        keywords: t('keywords').split(',').map(keyword => keyword.trim()),
        alternates: { canonical: url, languages: shellLanguages(PATH) },
        openGraph: {
            title,
            description,
            url,
            siteName: 'QuestioFlux',
            images: DEFAULT_QUIZ_IMAGE,
            locale: getOpenGraphLocale(locale),
            type: 'website',
        },
        twitter: { card: 'summary_large_image', title, description, images: [DEFAULT_QUIZ_IMAGE] },
    }
}

// Os formatos interativos (torneio, história, compatibilidade e pontuação). Cada card leva à
// página do formato, com o exemplo jogável e o botão de criar.
export default async function ExperiencesPage({ params }: IProps) {
    const { locale } = await params
    const [t, tCommon, tNames] = await Promise.all([
        getTranslations({ locale, namespace: 'experiencePages.index' }),
        getTranslations({ locale, namespace: 'experiencePages.common' }),
        getTranslations({ locale, namespace: 'quizTypes.names' }),
    ])
    const faq = t.raw('faq') as IFaq[]
    const url = `${SITE_URL}/${locale}${PATH}`

    const schema = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'CollectionPage',
                '@id': `${url}#webpage`,
                url,
                name: t('metadata.title'),
                description: t('metadata.desc'),
                inLanguage: LANGUAGE_TAGS[locale] ?? locale,
                publisher: { '@id': `${SITE_URL}/#organization` },
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: tCommon('breadcrumbHome'), item: `${SITE_URL}/${locale}` },
                    { '@type': 'ListItem', position: 2, name: tCommon('breadcrumbFormats') },
                ],
            },
            {
                '@type': 'FAQPage',
                mainEntity: faq.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
            },
        ],
    }

    const cards = await Promise.all(experienceKinds.map(async kind => {
        const tFormat = await getTranslations({ locale, namespace: `experiencePages.${kind}` })
        return { kind, text: tFormat('cardText') }
    }))

    return (
        <main className={styles.content}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />

            <nav className={styles.breadcrumb} aria-label="breadcrumb">
                <ol>
                    <li><Link locale={locale} href="/">{tCommon('breadcrumbHome')}</Link></li>
                    <li aria-current="page">{tCommon('breadcrumbFormats')}</li>
                </ol>
            </nav>

            <section className={styles.hero}>
                <div className={styles.hero_text}>
                    <span className={styles.eyebrow}>{t('eyebrow')}</span>
                    <h1>{t('title')}</h1>
                    <p className={styles.lead}>{t('lead')}</p>
                    <div className={own.hero_actions}>
                        <Link locale={locale} href="/create/experiences/tournament" className={styles.cta}>
                            {t('cta')} <ArrowRight aria-hidden="true" />
                        </Link>
                    </div>
                    <p className={styles.hero_note}><Check aria-hidden="true" /> {t('heroNote')}</p>
                </div>
                {/* o duelo do torneio aparece no card em destaque, logo abaixo */}
                <ExperiencePreview kind="story" locale={locale} styles={styles} />
            </section>

            <section className={styles.section} aria-labelledby="formats-title">
                <h2 id="formats-title">{t('formatsTitle')}</h2>
                <ul className={own.formats}>
                    {cards.map(({ kind, text }) => (
                        <li key={kind} className={kind === 'tournament' ? own.format_featured : undefined}>
                            <Link locale={locale} href={`/create/experiences/${kind}`}>
                                <span className={own.format_text}>
                                    <span className={own.icon}><QuizTypeIcon kind={kind} /></span>
                                    {kind === 'tournament' && <span className={own.format_badge}>{t('featured')}</span>}
                                    <h3>{tNames(kind)}</h3>
                                    <p>{text}</p>
                                    <span className={own.format_more}>{tCommon('seeMore')} <ArrowRight aria-hidden="true" /></span>
                                </span>
                                {kind === 'tournament' && <ExperiencePreview kind="tournament" locale={locale} styles={styles} />}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

            <section className={own.cross}>
                <span className={styles.eyebrow_icon}><QuizTypeIcon kind="quiz" /></span>
                <div>
                    <h2>{tCommon('quizTypesTitle')}</h2>
                    <p>{tCommon('quizTypesText')}</p>
                </div>
                <Link locale={locale} href="/create/quiz" className={own.cross_link}>
                    {tCommon('seeMore')} <ArrowRight aria-hidden="true" />
                </Link>
            </section>

            <section className={styles.section}>
                <h2>{tCommon('faqTitle')}</h2>
                <div className={styles.faq}>
                    {faq.map((item, index) => (
                        <details key={item.question} open={index === 0}>
                            <summary><h3>{item.question}</h3></summary>
                            <p>{item.answer}</p>
                        </details>
                    ))}
                </div>
            </section>
        </main>
    )
}
