import styles from '../(createQuiz)/create/quiz/[quizType]/quiz-type.module.scss'
import own from './pricing.module.scss'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ArrowRight, Check, Minus } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { TrackedLink } from '@/components/Google/analytics-widgets'
import PlanPrice from '@/components/Pricing/plan-price'
import CurrencySelector from '@/components/Subscription/currency-selector'
import { getOpenGraphLocale } from '@/utils/locale'
import { DEFAULT_QUIZ_IMAGE, jsonLd, shellLanguages, SITE_URL } from '@/utils/seo'
import FreePrice from './free-price'

interface IProps {
    params: Promise<{ locale: string }>
}

interface IFaq { question: string, answer: string }
interface ICompareRow { label: string, free: string, plus: string, pass: string }
interface ICompareGroup { title: string, rows: ICompareRow[] }

type PlanId = 'free' | 'plus' | 'pass'

// O grátis leva para a criação; os pagos, direto para o pagamento (que pede login)
const PLANS: Array<{ id: PlanId, href: string }> = [
    { id: 'free', href: '/create/quiz' },
    { id: 'plus', href: '/subscription/questioplus' },
    { id: 'pass', href: '/subscription/questioplususage' },
]

const PATH = '/pricing'
const LANGUAGE_TAGS: Record<string, string> = { pt: 'pt-BR', en: 'en-US', es: 'es', zh: 'zh-CN' }

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'pricingPage.metadata' })

    const url = `${SITE_URL}/${locale}${PATH}`
    const title = t('title')
    const description = t('desc')

    return {
        title,
        description,
        robots: { index: true, follow: true },
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

// Planos: os 3 cartões (grátis, mensal e passe), a comparação por formato e as dúvidas de compra.
// Os preços vêm ao vivo do Stripe, na moeda do idioma (ou na escolhida, em espanhol).
export default async function PricingPage({ params }: IProps) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'pricingPage' })

    const groups = t.raw('compare.groups') as ICompareGroup[]
    const faq = t.raw('faq.items') as IFaq[]
    const url = `${SITE_URL}/${locale}${PATH}`

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
                    { '@type': 'ListItem', position: 1, name: t('breadcrumbHome'), item: `${SITE_URL}/${locale}` },
                    { '@type': 'ListItem', position: 2, name: t('breadcrumb') },
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

    const cell = (value: string) => {
        if (value === 'yes') return <span className={own.yes}><Check aria-hidden="true" /><span className={own.sr_only}>{t('compare.yes')}</span></span>
        if (value === 'no') return <span className={own.no}><Minus aria-hidden="true" /><span className={own.sr_only}>{t('compare.no')}</span></span>
        return value
    }

    return (
        <main className={styles.content}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />

            <nav className={styles.breadcrumb} aria-label="breadcrumb">
                <ol>
                    <li><Link locale={locale} href="/">{t('breadcrumbHome')}</Link></li>
                    <li aria-current="page">{t('breadcrumb')}</li>
                </ol>
            </nav>

            <section className={`${styles.hero} ${own.hero}`}>
                <div className={styles.hero_text}>
                    <span className={`${styles.eyebrow} ${own.eyebrow}`}>{t('eyebrow')}</span>
                    <h1>{t('title')}</h1>
                    <p className={styles.lead}>{t('lead')}</p>
                </div>
            </section>

            <section className={own.plans_section} aria-labelledby="plans-title">
                <div className={own.plans_head}>
                    <h2 id="plans-title">{t('plansTitle')}</h2>
                    <CurrencySelector className={own.currency} activeClassName={own.currency_active} />
                </div>

                <ul className={own.plans}>
                    {PLANS.map(({ id, href }) => {
                        const featured = id === 'plus'
                        const features = t.raw(`plans.${id}.features`) as string[]

                        return (
                            <li key={id} className={`${own.plan} ${featured ? own.plan_featured : ''}`}>
                                {featured && <span className={own.badge}>{t('plans.plus.badge')}</span>}
                                <h3>{t(`plans.${id}.name`)}</h3>
                                <p className={own.price}>
                                    {id === 'free' ? <FreePrice /> : <PlanPrice plan={id === 'plus' ? 'plus' : 'usage'} />}
                                </p>
                                <p className={own.billing}>{t(`plans.${id}.billing`)}</p>
                                <ul className={own.features}>
                                    {features.map(feature => (
                                        <li key={feature}><Check aria-hidden="true" /> {feature}</li>
                                    ))}
                                </ul>
                                <TrackedLink
                                    event='select_content'
                                    params={{ content_type: 'pricing_cta', item_id: id }}
                                    locale={locale}
                                    href={href}
                                    className={`${own.plan_cta} ${featured ? own.plan_cta_primary : ''}`}
                                >
                                    {t(`plans.${id}.cta`)} <ArrowRight aria-hidden="true" />
                                </TrackedLink>
                            </li>
                        )
                    })}
                </ul>
            </section>

            <section className={styles.section} aria-labelledby="compare-title">
                <h2 id="compare-title">{t('compare.title')}</h2>
                <div className={own.table_wrap}>
                    <table className={own.table}>
                        <caption className={own.sr_only}>{t('compare.caption')}</caption>
                        <thead>
                            <tr>
                                <th scope="col">{t('compare.feature')}</th>
                                <th scope="col">{t('compare.free')}</th>
                                <th scope="col" className={own.col_plus}>{t('compare.plus')}</th>
                                <th scope="col">{t('compare.pass')}</th>
                            </tr>
                        </thead>
                        {groups.map(group => (
                            <tbody key={group.title}>
                                <tr className={own.group_row}>
                                    <th scope="colgroup" colSpan={4}>{group.title}</th>
                                </tr>
                                {group.rows.map(row => (
                                    <tr key={row.label}>
                                        <th scope="row">{row.label}</th>
                                        <td>{cell(row.free)}</td>
                                        <td className={own.col_plus}>{cell(row.plus)}</td>
                                        <td>{cell(row.pass)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        ))}
                    </table>
                </div>
            </section>

            <section className={styles.section} aria-labelledby="pricing-faq-title">
                <h2 id="pricing-faq-title">{t('faq.title')}</h2>
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
                <h2>{t('final.title')}</h2>
                <p>{t('final.text')}</p>
                <TrackedLink
                    event='select_content'
                    params={{ content_type: 'pricing_cta', item_id: 'free', position: 'footer' }}
                    locale={locale}
                    href="/create/quiz"
                    className={styles.cta}
                >
                    {t('final.cta')} <ArrowRight aria-hidden="true" />
                </TrackedLink>
            </section>
        </main>
    )
}
