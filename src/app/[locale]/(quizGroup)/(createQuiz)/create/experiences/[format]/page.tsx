import styles from '../../quiz/[quizType]/quiz-type.module.scss'
import own from '../experiences-page.module.scss'
import { Link } from '@/i18n/navigation'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { ArrowRight, Check } from 'lucide-react'
import QuizTypeIcon from '@/components/QuizTypes/quiz-type-icon'
import { TrackedLink } from '@/components/Google/analytics-widgets'
import ExperiencePreview from '@/components/Experiences/experience-preview'
import ExperienceDemo from '@/components/Experiences/experience-demo'
import { experienceTemplate } from '@/utils/experienceTemplates'
import { getOpenGraphLocale } from '@/utils/locale'
import { ExperienceKind, experienceKinds, isExperienceKind, quizKindHref } from '@/utils/quizKind'
import { DEFAULT_QUIZ_IMAGE, jsonLd, shellLanguages, SITE_URL } from '@/utils/seo'

interface IProps {
    params: Promise<{ locale: string, format: string }>
}

interface IItem { title: string, text: string }
interface IFaq { question: string, answer: string }

const LANGUAGE_TAGS: Record<string, string> = { pt: 'pt-BR', en: 'en-US', es: 'es', zh: 'zh-CN' }

// Formato parecido em /create/quiz: quem procura um costuma querer conhecer o outro
const CROSS_LINKS: Partial<Record<ExperienceKind, 'aboutMe' | 'personality'>> = {
    compatibility: 'aboutMe',
    scored: 'personality',
}

async function getFormatPage(params: IProps['params']) {
    const { locale, format } = await params
    if (!isExperienceKind(format)) notFound()
    return { locale, kind: format }
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const { locale, kind } = await getFormatPage(params)
    const t = await getTranslations({ locale, namespace: `experiencePages.${kind}.metadata` })

    const path = `/create/experiences/${kind}`
    const url = `${SITE_URL}/${locale}${path}`
    const title = t('title')
    const description = t('desc')

    return {
        title,
        description,
        robots: { index: true, follow: true },
        keywords: t('keywords').split(',').map(keyword => keyword.trim()),
        alternates: { canonical: url, languages: shellLanguages(path) },
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

// Página de cada formato de experiência: explica, tem o exemplo jogável e leva para a criação
// (do zero ou a partir do modelo).
export default async function ExperienceFormatPage({ params }: IProps) {
    const { locale, kind } = await getFormatPage(params)

    const [t, tCommon, tNames] = await Promise.all([
        getTranslations({ locale, namespace: `experiencePages.${kind}` }),
        getTranslations({ locale, namespace: 'experiencePages.common' }),
        getTranslations({ locale, namespace: 'quizTypes.names' }),
    ])

    const steps = t.raw('steps') as IItem[]
    const features = t.raw('features') as IItem[]
    const ideas = t.raw('ideas') as string[]
    const faq = t.raw('faq') as IFaq[]

    const url = `${SITE_URL}/${locale}/create/experiences/${kind}`
    const createHref = `/create/quiz/cover?type=${kind}`
    const template = experienceTemplate(kind, locale)
    const cross = CROSS_LINKS[kind]
    const others = experienceKinds.filter(other => other !== kind)
    const ctaParams = (position: string) => ({ content_type: 'experience_cta', item_id: kind, position })

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
                    { '@type': 'ListItem', position: 2, name: tCommon('breadcrumbFormats'), item: `${SITE_URL}/${locale}/create/experiences` },
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
                    <li><Link locale={locale} href="/create/experiences">{tCommon('breadcrumbFormats')}</Link></li>
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

                    <div className={own.hero_actions}>
                        <TrackedLink event='select_content' params={ctaParams('hero')} locale={locale} href={createHref} className={styles.cta}>
                            {t('cta')} <ArrowRight aria-hidden="true" />
                        </TrackedLink>
                        <a href="#demo-title" className={own.hero_secondary}>{tCommon('tryExample')}</a>
                    </div>

                    <p className={styles.hero_note}><Check aria-hidden="true" /> {t('heroNote')}</p>
                </div>

                <ExperiencePreview kind={kind} locale={locale} styles={styles} />
            </section>

            <ExperienceDemo template={template} />

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

            {cross && (
                <section className={own.cross}>
                    <span className={styles.eyebrow_icon}><QuizTypeIcon kind={cross} /></span>
                    <div>
                        <h2>{t('cross.title')}</h2>
                        <p>{t('cross.text')}</p>
                    </div>
                    <Link locale={locale} href={quizKindHref(cross)} className={own.cross_link}>
                        {t('cross.cta')} <ArrowRight aria-hidden="true" />
                    </Link>
                </section>
            )}

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
                <TrackedLink event='select_content' params={ctaParams('footer')} locale={locale} href={createHref} className={styles.cta}>
                    {t('finalCta')} <ArrowRight aria-hidden="true" />
                </TrackedLink>
            </section>

            <section className={styles.section}>
                <h2>{tCommon('otherTitle')}</h2>
                <ul className={styles.other_types}>
                    {await Promise.all(others.map(async other => {
                        const tOther = await getTranslations({ locale, namespace: `experiencePages.${other}` })
                        return (
                            <li key={other}>
                                <Link locale={locale} href={`/create/experiences/${other}`}>
                                    <span className={styles.eyebrow_icon}><QuizTypeIcon kind={other} /></span>
                                    <span className={styles.other_text}>
                                        <strong>{tNames(other)}</strong>
                                        <span>{tOther('cardText')}</span>
                                    </span>
                                    <span className={styles.other_more}>{tCommon('seeMore')} <ArrowRight aria-hidden="true" /></span>
                                </Link>
                            </li>
                        )
                    }))}
                    <li>
                        <Link locale={locale} href="/create/quiz">
                            <span className={styles.eyebrow_icon}><QuizTypeIcon kind="quiz" /></span>
                            <span className={styles.other_text}>
                                <strong>{tCommon('quizTypesTitle')}</strong>
                                <span>{tCommon('quizTypesText')}</span>
                            </span>
                            <span className={styles.other_more}>{tCommon('seeMore')} <ArrowRight aria-hidden="true" /></span>
                        </Link>
                    </li>
                </ul>
            </section>
        </main>
    )
}
