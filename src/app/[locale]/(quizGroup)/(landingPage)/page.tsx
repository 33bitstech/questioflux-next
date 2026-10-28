import styles from './lp.module.scss'
import { Link } from "@/i18n/navigation";
import CloverSvg from "@/components/Icons/CloverSvg";
import SmileSvg from "@/components/Icons/SmileSvg";
import ExamSvg from "@/components/Icons/ExamSvg";
import { quizKindSlug } from '@/utils/quizKind';
import LockedSvg from "@/components/Icons/LockedSvg";
import StrokeProfileSvg from "@/components/Icons/StrokeProfileSvg";
import WorldSvg from "@/components/Icons/WorldSvg";
import Wave from "@/components/wave";
import RegisterComponent from '@/components/AuthForms/register-component';
import ScrollToSection from '@/components/LandingPage/scroll-to-section';
import LandingAd from '@/components/Google/LandingAd';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from "next";
import { env } from '@/env';
import { getOpenGraphLocale } from '@/utils/locale';

interface IProps {
    params: Promise<{
        locale: string
    }>
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
    const t = await getTranslations({ locale, namespace: 'landingPage' });

    return (
        <>
            <main className={styles.content}>
                <section id='create_quiz' className={styles.create_quiz}>
                    <div className={styles.title_section}>
                        <h1>
                            <span>{t.rich('hero.titleLine1', { bold: (chunks) => <strong>{chunks}</strong> })}</span>
                            <span>{t.rich('hero.titleLine2', { bold: (chunks) => <strong>{chunks}</strong> })}</span>
                            <span className={styles.fakeh2}>{t('hero.subtitle')}</span>
                        </h1>
                    </div>
                    <div id="actions_section" className={styles.actions_section}>
                        <ul>
                            <li><span><CloverSvg /></span></li>
                            <li><span><SmileSvg /></span></li>
                            <li><span><StrokeProfileSvg /></span></li>
                            <li><span><ExamSvg /></span></li>
                        </ul>
                        {/* leva à criação (tipos de quiz e "Criar agora"); o cadastro só aparece quando a criação pedir login */}
                        <ScrollToSection targetId='quiz_styles_section' className={styles.button_link}>{t('hero.ctaButton')}</ScrollToSection>
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
                                <span><CloverSvg /></span>
                                <p>{t.rich('stylesSection.rightAndWrong', { span: (chunks) => <span>{chunks}</span> })}</p>
                            </Link>
                        </li>
                        <li className={styles.linked_item}>
                            <Link href={`/create/quiz/${quizKindSlug('exam')}`} locale={locale}>
                                <span><ExamSvg /></span>
                                <p>{t.rich('stylesSection.exam', { span: (chunks) => <span>{chunks}</span> })}</p>
                            </Link>
                        </li>
                        <li className={styles.linked_item}>
                            <Link href={`/create/quiz/${quizKindSlug('aboutMe')}`} locale={locale}>
                                <span><StrokeProfileSvg /></span>
                                <p>{t.rich('stylesSection.aboutMe', { span: (chunks) => <span>{chunks}</span> })}</p>
                            </Link>
                        </li>
                        <li className={styles.linked_item}>
                            <Link href={`/create/quiz/${quizKindSlug('personality')}`} locale={locale}>
                                <span><SmileSvg /></span>
                                <p>{t.rich('stylesSection.personality', { span: (chunks) => <span>{chunks}</span> })}</p>
                            </Link>
                        </li>
                    </ul>
                    <Link href='/create/quiz' locale={locale} className={styles.button_link}>{t('stylesSection.ctaButton')}</Link>
                    {/* abaixo do "Criar agora", na seção do criador (onde o "Comece agora" do topo leva) */}
                    <LandingAd />
                </section>

                <section id='quiz_exploration_section' className={styles.quiz_exploration_section}>
                    <div className={`${styles.title_section} ${styles.subtitle}`}>
                        <h2>{t('explorationSection.title')}</h2>
                        <p>{t('explorationSection.subtitle')}</p>
                    </div>
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
                <Link locale={locale} href={'/blog'}>{t('footer.blogLink')}</Link>
            </footer>
        </>
    );
}