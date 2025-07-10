import styles from './lp.module.scss'
import {Link} from "@/i18n/navigation";
import CloverSvg from "@/components/Icons/CloverSvg";
import SmileSvg from "@/components/Icons/SmileSvg";
import ListSvg from "@/components/Icons/ListSvg";
import LockedSvg from "@/components/Icons/LockedSvg";
import StrokeProfileSvg from "@/components/Icons/StrokeProfileSvg";
import WorldSvg from "@/components/Icons/WorldSvg";
import Wave from "@/components/wave";
import RegisterComponent from '@/components/AuthForms/register-component';
import { getTranslations } from 'next-intl/server'; // Importar a função
import GoogleAd from '@/components/Google/GoogleAd';
import type { Metadata } from "next";

interface IProps{
    params: Promise<{
        locale: string
    }>
}


export const metadata: Metadata = {
    robots: 'index, follow',
    keywords: "quiz, landing_page, quiz_maker, create_quiz"
};

export default async function LandingPage({params}:IProps) {
    const {locale} = await params
    const t = await getTranslations({locale, namespace:'landingPage'});

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
                            <li><span><CloverSvg/></span></li>
                            <li><span><SmileSvg/></span></li>
                            <li><span><StrokeProfileSvg/></span></li>
                            <li><span><ListSvg/></span></li>
                        </ul>
                        <Link href={`#register_comp_section`} className={styles.button_link}>{t('hero.ctaButton')}</Link>
                        <Link href={'/explore'} locale={locale} className={styles.explore_link} >{t('hero.exploreButton')}</Link>
                    </div>
                </section>

                <div className={styles.wave}><Wave/></div>

                <section id='quiz_styles_section' className={styles.quiz_styles_section}>
                    <div className={`${styles.title_section} ${styles.subtitle}`}>
                        <h2>{t('stylesSection.title')}</h2>
                        <p>{t('stylesSection.subtitle')}</p>
                    </div>
                    <ul id='quiz_styles' className={styles.box_itens}>
                        <li>
                            <span><CloverSvg/></span>
                            <p>{t.rich('stylesSection.rightAndWrong', { span: (chunks) => <span>{chunks}</span> })}</p>
                        </li>
                        <li>
                            <span><SmileSvg/></span>
                            <p>{t.rich('stylesSection.personality', { span: (chunks) => <span>{chunks}</span> })}</p>
                        </li>
                        <li>
                            <span><ListSvg/></span>
                            <p>{t.rich('stylesSection.list', { span: (chunks) => <span>{chunks}</span> })}</p>
                        </li>
                        <li>
                            <span><StrokeProfileSvg/></span>
                            <p>{t.rich('stylesSection.aboutMe', { span: (chunks) => <span>{chunks}</span> })}</p>
                        </li>
                    </ul>
                    <Link href='/create/quiz' locale={locale} className={styles.button_link}>{t('stylesSection.ctaButton')}</Link>
                </section>

                <GoogleAd/>

                <section id='quiz_exploration_section' className={styles.quiz_exploration_section}>
                    <div className={`${styles.title_section} ${styles.subtitle}`}>
                        <h2>{t('explorationSection.title')}</h2>
                        <p>{t('explorationSection.subtitle')}</p>
                    </div>
                    <ul id='quiz_types' className={styles.box_itens}>
                        <li>
                            <span><WorldSvg/></span>
                            <p>{t.rich('explorationSection.public', { span: (chunks) => <span>{chunks}</span> })}</p>
                        </li>
                        <li>
                            <span><LockedSvg/></span>
                            <p>{t.rich('explorationSection.private', { span: (chunks) => <span>{chunks}</span> })}</p>
                        </li>
                    </ul>
                </section>

                <div className={styles.wave}><Wave/></div>

                <GoogleAd/>

                <section id='register_comp_section' className={styles.register_comp_section}>
                    <RegisterComponent 
                        absolute={false}
                        toLogin={async ()=>{'use server'}}
                        locale={locale}
                    />
                </section>
            </main>

            <GoogleAd/>

            <footer className={styles.footer}>
                <Link locale={locale} href={'/about-us'}>{t('footer.aboutLink')}</Link>
            </footer>
        </>
    );
}