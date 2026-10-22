import styles from './quiz-type.module.scss'
import { Link } from '@/i18n/navigation'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { ArrowRight, Check } from 'lucide-react'
import QuizTypeIcon from '@/components/QuizTypes/quiz-type-icon'
import QuizTypePreview from '@/components/QuizTypes/quiz-type-preview'
import { TrackedLink } from '@/components/Google/analytics-widgets'
import { getOpenGraphLocale } from '@/utils/locale'
import { isQuizTypeSlug, QuizKind, quizTypeSlugs, QuizTypeSlug } from '@/utils/quizKind'
import { DEFAULT_QUIZ_IMAGE, jsonLd, shellLanguages, SITE_URL } from '@/utils/seo'

interface IProps {
    params: Promise<{ locale: string, quizType: string }>
}

interface IItem { title: string, text: string }
interface IFaq { question: string, answer: string }

const LANGUAGE_TAGS: Record<string, string> = { pt: 'pt-BR', en: 'en-US', es: 'es' }

// Página de cada tipo de quiz: é ela que concorre no Google por "criar prova online",
// "quiz sobre mim"... e leva para a criação já com o tipo escolhido.
async function getTypePage(params: IProps['params']) {
    const { locale, quizType } = await params

    if (!isQuizTypeSlug(quizType)) notFound()

    return { locale, slug: quizType as QuizTypeSlug, kind: quizTypeSlugs[quizType] as QuizKind }
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const { locale, slug, kind } = await getTypePage(params)
    const t = await getTranslations({ locale, namespace: `quizTypePages.${kind}.metadata` })

    const path = `/create/quiz/${slug}`
    const url = `${SITE_URL}/${locale}${path}`
    const title = t('title')
    const description = t('desc')

    return {
        title,
        description,
        robots: { index: true, follow: true },
        keywords: t('keywords').split(',').map(keyword => keyword.trim()),
        alternates: {
            canonical: url,
            languages: shellLanguages(path),
        },
        openGraph: {
            title,
            description,
            url,
            siteName: 'QuestioFlux',
            images: DEFAULT_QUIZ_IMAGE,
            locale: getOpenGraphLocale(locale),
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [DEFAULT_QUIZ_IMAGE],
        },
    }
}

export default async function QuizTypePage({ params }: IProps) {
    const { locale, slug, kind } = await getTypePage(params)

    const [t, tCommon, tNames] = await Promise.all([
        getTranslations({ locale, namespace: `quizTypePages.${kind}` }),
        getTranslations({ locale, namespace: 'quizTypePages.common' }),
        getTranslations({ locale, namespace: 'quizTypes.names' }),
    ])

    const steps = t.raw('steps') as IItem[]
    const features = t.raw('features') as IItem[]
    const ideas = t.raw('ideas') as string[]
    const faq = t.raw('faq') as IFaq[]

    const url = `${SITE_URL}/${locale}/create/quiz/${slug}`
    const createHref = `/create/quiz/cover?type=${kind}`
    const otherTypes = (Object.entries(quizTypeSlugs) as Array<[QuizTypeSlug, QuizKind]>).filter(([other]) => other !== slug)

    const ctaParams = (position: string) => ({ content_type: 'quiz_type_cta', item_id: kind, position })

    // O schema repete o que a página mostra: o caminho de navegação e as perguntas frequentes.
    const schema = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
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
                    { '@type': 'ListItem', position: 2, name: tCommon('breadcrumbCreate'), item: `${SITE_URL}/${locale}/create/quiz` },
                    { '@type': 'ListItem', position: 3, name: t('eyebrow') },
                ],
            },
            {
                '@type': 'FAQPage',
                mainEntity: faq.map(item => ({
                    '@type': 'Question',
                    name: item.question,
                    acceptedAnswer: { '@type': 'Answer', text: item.answer },
                })),
            },
        ],
    }

    return (
        <main className={styles.content}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />

            <nav className={styles.breadcrumb} aria-label="breadcrumb">
                <ol>
                    <li><Link locale={locale} href="/">{tCommon('breadcrumbHome')}</Link></li>
                    <li><Link locale={locale} href="/create/quiz">{tCommon('breadcrumbCreate')}</Link></li>
                    <li aria-current="page">{t('eyebrow')}</li>
                </ol>
            </nav>

            <section className={styles.hero}>
                <div className={styles.hero_text}>
                    <span className={styles.eyebrow}>
                        <span className={styles.eyebrow_icon}><QuizTypeIcon kind={kind} /></span>
                        {t('eyebrow')}
                    </span>
                    <h1>{t('title')}</h1>
                    <p className={styles.lead}>{t('lead')}</p>

                    <TrackedLink
                        event='select_content'
                        params={ctaParams('hero')}
                        locale={locale}
                        href={createHref}
                        className={styles.cta}
                    >
                        {t('cta')} <ArrowRight aria-hidden="true" />
                    </TrackedLink>

                    <p className={styles.hero_note}><Check aria-hidden="true" /> {t('heroNote')}</p>
                </div>

                <QuizTypePreview kind={kind} locale={locale} styles={styles} />
            </section>

            <section className={styles.section}>
                <h2>{tCommon('howTitle')}</h2>
                <ol className={styles.steps}>
                    {steps.map((step, index) => (
                        <li key={step.title}>
                            <span className={styles.step_number}>{index + 1}</span>
                            <h3>{step.title}</h3>
                            <p>{step.text}</p>
                        </li>
                    ))}
                </ol>
            </section>

            <section className={styles.section}>
                <h2>{tCommon('featuresTitle')}</h2>
                <ul className={styles.features}>
                    {features.map(feature => (
                        <li key={feature.title}>
                            <h3>{feature.title}</h3>
                            <p>{feature.text}</p>
                        </li>
                    ))}
                </ul>
            </section>

            <section className={styles.section}>
                <h2>{t('ideasTitle')}</h2>
                <ul className={styles.ideas}>
                    {ideas.map(idea => <li key={idea}>{idea}</li>)}
                </ul>
            </section>

            <section className={styles.section}>
                <h2>{tCommon('faqTitle')}</h2>
                <div className={styles.faq}>
                    {faq.map((item, index) => (
                        // o texto fica no HTML mesmo fechado: o Google lê sem clicar
                        <details key={item.question} open={index === 0}>
                            <summary><h3>{item.question}</h3></summary>
                            <p>{item.answer}</p>
                        </details>
                    ))}
                </div>
            </section>

            <section className={styles.final_cta}>
                <h2>{t('finalTitle')}</h2>
                <p>{t('finalText')}</p>
                <TrackedLink
                    event='select_content'
                    params={ctaParams('footer')}
                    locale={locale}
                    href={createHref}
                    className={styles.cta}
                >
                    {t('finalCta')} <ArrowRight aria-hidden="true" />
                </TrackedLink>
            </section>

            <section className={styles.section}>
                <h2>{tCommon('otherTypesTitle')}</h2>
                <ul className={styles.other_types}>
                    {await Promise.all(otherTypes.map(async ([otherSlug, otherKind]) => {
                        const tOther = await getTranslations({ locale, namespace: `quizTypePages.${otherKind}` })

                        return (
                            <li key={otherSlug}>
                                <Link locale={locale} href={`/create/quiz/${otherSlug}`}>
                                    <span className={styles.eyebrow_icon}><QuizTypeIcon kind={otherKind} /></span>
                                    <span className={styles.other_text}>
                                        <strong>{tNames(otherKind)}</strong>
                                        <span>{tOther('cardText')}</span>
                                    </span>
                                    <span className={styles.other_more}>
                                        {tCommon('seeMore')} <ArrowRight aria-hidden="true" />
                                    </span>
                                </Link>
                            </li>
                        )
                    }))}
                </ul>
            </section>
        </main>
    )
}
