import { Link } from '@/i18n/navigation'
import styles from './create-quiz-page.module.scss'
import QuizTypeIcon from '@/components/QuizTypes/quiz-type-icon'
import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { env } from '@/env'
import { getOpenGraphLocale } from '@/utils/locale'
import { QuizKind, quizKindSlug } from '@/utils/quizKind'
import { ReactNode } from 'react'

interface IProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'createQuizFlow.selectTypePage' });

    const langs = {
        'es': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/es/create/quiz`,
        'en-US': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/create/quiz`,
        'pt-BR': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/pt/create/quiz`,
        'zh-CN': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/zh/create/quiz`,
        'x-default': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/create/quiz`
    }

    const title = t('metadata.title')
    const description = t('metadata.desc')

    return {
        title,
        description,
        robots: 'index, follow',
        keywords: t('metadata.keywords').split(',').map(keyword => keyword.trim()),
        alternates: {
            canonical: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/create/quiz`,
            languages: langs
        },
        openGraph: {
            title,
            description,
            url: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/create/quiz`,
            siteName: 'QuestioFlux',
            images: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/quiz_padrao_preto.png`,
            locale: getOpenGraphLocale(locale),
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [`${env.NEXT_PUBLIC_DOMAIN_FRONT}/quiz_padrao_preto.png`],
        }
    }
}

// Cada card leva à página do tipo (/create/quiz/exam...), que explica e tem o botão de criar.
const AVAILABLE_TYPES: Array<{ kind: QuizKind, text: 'rightAndWrong' | 'exam' | 'aboutMe' | 'personality' }> = [
    { kind: 'quiz', text: 'rightAndWrong' },
    { kind: 'exam', text: 'exam' },
    { kind: 'aboutMe', text: 'aboutMe' },
    { kind: 'personality', text: 'personality' },
]

export default async function CreateQuizPage({ params }: IProps) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'createQuizFlow.selectTypePage' });
    const tShared = await getTranslations({ locale, namespace: 'landingPage.stylesSection' });

    const bold = (chunks: ReactNode) => <span>{chunks}</span>

    return (
        <main className={styles.content}>
            <div className={styles.create_quiz_types}>
                <div>
                    <h1>{t('title')}</h1>
                    <h2>{t('desc')}</h2>
                    <p>{t('subtitle')}</p>
                </div>
                <nav aria-label={t('title')}>
                    <ul className={styles.type_list}>
                        {AVAILABLE_TYPES.map(({ kind, text }) => (
                            <li key={kind} className={styles.type_actived}>
                                <Link locale={locale} href={`/create/quiz/${quizKindSlug(kind)}`}>
                                    <span className={styles.icon_emoji}><QuizTypeIcon kind={kind} /></span>
                                    <p>{tShared.rich(text, { span: bold })}</p>
                                    <span className={styles.see_more}>
                                        {t('seeMore')} <ArrowRight aria-hidden="true" />
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <section className={styles.description_types}>
                <div className={styles.description_header}>
                    <span>QuestioFlux</span>
                    <h2>{t('descriptions.rightAndWrongTitle')}</h2>
                    <p>{t('descriptions.rightAndWrongText')}</p>
                </div>

                <div className={styles.description_grid}>
                    <article>
                        <span>01</span>
                        <h2>{t('descriptions.competitionTitle')}</h2>
                        <p>{t('descriptions.competitionText')}</p>
                    </article>

                    <article>
                        <span>02</span>
                        <h2>{t('descriptions.studentTitle')}</h2>
                        <p>{t('descriptions.studentText')}</p>
                        <Link locale={locale} href={`/create/quiz/${quizKindSlug('exam')}`} className={styles.article_link}>
                            {t('descriptions.studentLink')} <ArrowRight aria-hidden="true" />
                        </Link>
                    </article>

                    <article>
                        <span>03</span>
                        <h2>{t('descriptions.aboutMeTitle')}</h2>
                        <p>{t('descriptions.aboutMeText')}</p>
                        <Link locale={locale} href={`/create/quiz/${quizKindSlug('aboutMe')}`} className={styles.article_link}>
                            {t('descriptions.aboutMeLink')} <ArrowRight aria-hidden="true" />
                        </Link>
                    </article>

                    <article>
                        <span>04</span>
                        <h2>{t('descriptions.imageTitle')}</h2>
                        <p>{t('descriptions.imageText')}</p>
                    </article>
                </div>

                <section className={styles.faq_section}>
                    <div className={styles.faq_header}>
                        <span>FAQ</span>
                        <h2>{t('faq.title')}</h2>
                        <p>{t('faq.intro')}</p>
                    </div>

                    <div className={styles.faq_grid}>
                        <article>
                            <span>Q1</span>
                            <div>
                                <h3>{t('faq.question1Title')}</h3>
                                <p>{t('faq.question1Text')}</p>
                            </div>
                        </article>

                        <article>
                            <span>Q2</span>
                            <div>
                                <h3>{t('faq.question2Title')}</h3>
                                <p>{t('faq.question2Text')}</p>
                            </div>
                        </article>

                        <article>
                            <span>Q3</span>
                            <div>
                                <h3>{t('faq.question3Title')}</h3>
                                <p>{t('faq.question3Text')}</p>
                            </div>
                        </article>

                        <article>
                            <span>Q4</span>
                            <div>
                                <h3>{t('faq.question4Title')}</h3>
                                <p>{t('faq.question4Text')}</p>
                            </div>
                        </article>

                        <article>
                            <span>Q5</span>
                            <div>
                                <h3>{t('faq.question5Title')}</h3>
                                <p>{t('faq.question5Text')}</p>
                            </div>
                        </article>
                    </div>
                </section>
            </section>

        </main>
    )
}