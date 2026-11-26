import styles from './lp.module.scss'
import formatStyles from '../(createQuiz)/create/experiences/experiences-page.module.scss'
import typeStyles from '../(createQuiz)/create/quiz/[quizType]/quiz-type.module.scss'
import { Link } from "@/i18n/navigation";
import QuizTypeIcon from '@/components/QuizTypes/quiz-type-icon';
import ExperiencePreview from '@/components/Experiences/experience-preview';
import QuizCard from '@/components/Card/quiz-card';
import { experienceKinds, isExperienceKind, QuizKind, quizKindSlug, quizKinds } from '@/utils/quizKind';
import { ExploreType, exploreHref } from '@/utils/exploreFilters';
import LockedSvg from "@/components/Icons/LockedSvg";
import WorldSvg from "@/components/Icons/WorldSvg";
import Wave from "@/components/wave";
import RegisterComponent from '@/components/AuthForms/register-component';
import ScrollToSection from '@/components/LandingPage/scroll-to-section';
import LandingAd from '@/components/Google/LandingAd';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from "next";
import { ArrowRight } from 'lucide-react';
import { env } from '@/env';
import { getOpenGraphLocale } from '@/utils/locale';
import ApiData from '@/utils/ApiData';
import IQuizes from '@/interfaces/IQuizes';

interface IProps {
    params: Promise<{
        locale: string
    }>
}

// no endereço do Explorar, os formatos interativos usam o próprio tipo como slug
const exploreType = (kind: QuizKind): ExploreType => isExperienceKind(kind) ? kind : quizKindSlug(kind)

// Os mais jogados entre os públicos (a mesma lista do topo do Explorar, sem privados nem
// rascunhos), guardada por uma hora para a home não consultar a API a cada visita
async function getPopularCreations(): Promise<IQuizes[]> {
    try {
        const response = await ApiData({
            path: 'v2/most-popular-quizzes',
            method: 'GET',
            cache: { next: { revalidate: 60 * 60 } },
        })
        if (!response.ok) return []
        const res = await response.json()
        return Array.isArray(res?.quizzes) ? res.quizzes : []
    } catch {
        return []
    }
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'landingPage' });

    const langs = {
        'es': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/es`,
        'en-US': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en`,
        'pt-BR': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/pt`,
        'zh-CN': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/zh`,
        'x-default': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en`
    }

    const title = t('metadataTitle')
    const description = t('metadataDesc')

    return {
        title,
        description,
        robots: 'index, follow',
        keywords: t('metadataKeywords').split(',').map(keyword => keyword.trim()),
        alternates: {
            canonical: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}`,
            languages: langs
        },
        openGraph: {
            title,
            description,
            url: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}`,
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

export default async function LandingPage({ params }: IProps) {
    const { locale } = await params
    const [t, tNames, popular] = await Promise.all([
        getTranslations({ locale, namespace: 'landingPage' }),
        getTranslations({ locale, namespace: 'quizTypes.names' }),
        getPopularCreations(),
    ])

    const formats = await Promise.all(experienceKinds.map(async kind => {
        const tFormat = await getTranslations({ locale, namespace: `experiencePages.${kind}` })
        return { kind, text: tFormat('cardText') }
    }))

    return (
        <>
            <main className={styles.content}>
                <section id='create_quiz' className={styles.create_quiz}>
                    <div className={styles.title_section}>
                        <h1>{t.rich('hero.title', { bold: (chunks) => <strong>{chunks}</strong> })}</h1>
                        <p className={styles.hero_subtitle}>{t('hero.subtitle')}</p>
                    </div>
                    <div id="actions_section" className={styles.actions_section}>
                        {/* um atalho para cada família de criação; o cadastro só aparece quando a criação pedir login */}
                        <div className={styles.shortcuts}>
                            <ScrollToSection targetId='quiz_styles_section' className={styles.shortcut}>
                                <span className={styles.shortcut_icon}><QuizTypeIcon kind='quiz' /></span>
                                <span className={styles.shortcut_text}>
                                    <strong>{t('hero.quizzesShortcut')}</strong>
                                    <span>{t('hero.quizzesShortcutText')}</span>
                                </span>
                            </ScrollToSection>
                            <ScrollToSection targetId='formats_section' className={styles.shortcut}>
                                <span className={styles.shortcut_icon}><QuizTypeIcon kind='tournament' /></span>
                                <span className={styles.shortcut_text}>
                                    <strong>{t('hero.formatsShortcut')}</strong>
                                    <span>{t('hero.formatsShortcutText')}</span>
                                </span>
                            </ScrollToSection>
                        </div>
                        <Link href={'/explore'} locale={locale} className={styles.explore_link} >{t('hero.exploreButton')}</Link>
                    </div>
                </section>

                <div className={styles.wave}><Wave /></div>

                <section id='quiz_styles_section' className={styles.quiz_styles_section}>
                    <div className={`${styles.title_section} ${styles.subtitle}`}>
                        <h2>{t('stylesSection.title')}</h2>
                        <p>{t('stylesSection.subtitle')}</p>
                    </div>
                    <ul id='quiz_styles' className={styles.box_itens}>
                        <li className={styles.linked_item}>
                            <Link href={`/create/quiz/${quizKindSlug('quiz')}`} locale={locale}>
                                <span><QuizTypeIcon kind='quiz' /></span>
                                <p>{t.rich('stylesSection.rightAndWrong', { span: (chunks) => <span>{chunks}</span> })}</p>
                            </Link>
                        </li>
                        <li className={styles.linked_item}>
                            <Link href={`/create/quiz/${quizKindSlug('exam')}`} locale={locale}>
                                <span><QuizTypeIcon kind='exam' /></span>
                                <p>{t.rich('stylesSection.exam', { span: (chunks) => <span>{chunks}</span> })}</p>
                            </Link>
                        </li>
                        <li className={styles.linked_item}>
                            <Link href={`/create/quiz/${quizKindSlug('aboutMe')}`} locale={locale}>
                                <span><QuizTypeIcon kind='aboutMe' /></span>
                                <p>{t.rich('stylesSection.aboutMe', { span: (chunks) => <span>{chunks}</span> })}</p>
                            </Link>
                        </li>
                        <li className={styles.linked_item}>
                            <Link href={`/create/quiz/${quizKindSlug('personality')}`} locale={locale}>
                                <span><QuizTypeIcon kind='personality' /></span>
                                <p>{t.rich('stylesSection.personality', { span: (chunks) => <span>{chunks}</span> })}</p>
                            </Link>
                        </li>
                    </ul>
                    <Link href='/create/quiz' locale={locale} className={styles.button_link}>{t('stylesSection.ctaButton')}</Link>
                    {/* abaixo do botão da seção de quizzes, onde o primeiro atalho do topo leva */}
                    <LandingAd />
                </section>

                {/* torneio, história, compatibilidade e pontuação: cada card abre a página do formato */}
                <section id='formats_section' className={styles.formats_section} aria-labelledby='formats_title'>
                    <div className={`${styles.title_section} ${styles.subtitle}`}>
                        <h2 id='formats_title'>{t('formatsSection.title')}</h2>
                        <p>{t('formatsSection.subtitle')}</p>
                    </div>
                    <ul className={`${formatStyles.formats} ${styles.formats_list}`}>
                        {formats.map(({ kind, text }) => (
                            <li key={kind} className={kind === 'tournament' ? formatStyles.format_featured : undefined}>
                                <Link locale={locale} href={`/create/experiences/${kind}`}>
                                    <span className={formatStyles.format_text}>
                                        <span className={formatStyles.icon}><QuizTypeIcon kind={kind} /></span>
                                        {kind === 'tournament' && <span className={formatStyles.format_badge}>{t('formatsSection.featured')}</span>}
                                        <h3>{tNames(kind)}</h3>
                                        <p>{text}</p>
                                        <span className={formatStyles.format_more}>{t('formatsSection.seeMore')} <ArrowRight aria-hidden="true" /></span>
                                    </span>
                                    {/* o duelo do modelo do idioma da página */}
                                    {kind === 'tournament' && <ExperiencePreview kind="tournament" locale={locale} styles={typeStyles} />}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <Link href='/create/experiences' locale={locale} className={styles.button_link}>{t('formatsSection.ctaButton')}</Link>
                </section>

                <section id='quiz_exploration_section' className={styles.quiz_exploration_section}>
                    <div className={`${styles.title_section} ${styles.subtitle}`}>
                        <h2>{t('explorationSection.title')}</h2>
                        <p>{t('explorationSection.subtitle')}</p>
                    </div>

                    {popular.length > 0 && (
                        <div className={styles.popular_list}>
                            {popular.map(quiz => <QuizCard key={quiz.quizId} quiz={quiz} />)}
                        </div>
                    )}

                    <nav className={styles.explore_formats} aria-labelledby='explore_formats_label'>
                        <p id='explore_formats_label'>{t('explorationSection.byFormat')}</p>
                        <ul>
                            {quizKinds.map(kind => (
                                <li key={kind}>
                                    <Link locale={locale} href={exploreHref({ type: exploreType(kind) })}>
                                        <QuizTypeIcon kind={kind} />
                                        {tNames(kind)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <ul id='quiz_types' className={styles.box_itens}>
                        <li>
                            <span><WorldSvg /></span>
                            <p>{t.rich('explorationSection.public', { span: (chunks) => <span>{chunks}</span> })}</p>
                        </li>
                        <li>
                            <span><LockedSvg /></span>
                            <p>{t.rich('explorationSection.private', { span: (chunks) => <span>{chunks}</span> })}</p>
                        </li>
                    </ul>
                    <Link href='/explore' locale={locale} className={styles.button_link}>{t('explorationSection.ctaButton')}</Link>
                </section>

                <div className={styles.wave}><Wave /></div>

                <section id='register_comp_section' className={styles.register_comp_section}>
                    <RegisterComponent
                        absolute={false}
                        toLogin={async () => { 'use server' }}
                        locale={locale}
                    />
                </section>
            </main>

            <footer className={styles.footer}>
                <Link locale={locale} href={'/about-us'}>{t('footer.aboutLink')}</Link>
                <Link locale={locale} href={'/pricing'}>{t('footer.pricingLink')}</Link>
                <Link locale={locale} href={'/blog'}>{t('footer.blogLink')}</Link>
            </footer>
        </>
    );
}
