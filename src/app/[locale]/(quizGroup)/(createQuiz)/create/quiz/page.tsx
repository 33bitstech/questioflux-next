import {Link} from '@/i18n/navigation'
import React from 'react'
import styles from './create-quiz-page.module.scss'
import SmileSvg from '@/components/Icons/SmileSvg'
import CloverSvg from '@/components/Icons/CloverSvg'
import SoonSvg from '@/components/Icons/SoonSvg'
import ListSvg from '@/components/Icons/ListSvg'
import StrokeProfileSvg from '@/components/Icons/StrokeProfileSvg'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { env } from '@/env'

interface IProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const {locale} = await params
    const t = await getTranslations({ locale, namespace: 'createQuizFlow' });

    const langs = {
        'en-US': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/create/quiz`,
        'pt-BR': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/pt/create/quiz`,
        'x-default': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/create/quiz`
    }

    return {
        title: t('layout.metadataTitle'),
        description: t('selectTypePage.desc'),
        robots: 'index, follow',
        keywords: "quiz, create, type",
        alternates:{
            canonical: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/create/quiz`,
            languages: langs
        },
        openGraph: {
            title: t('layout.metadataTitle'),
            description: t('selectTypePage.desc'),
            url: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/create/quiz`, 
            siteName: 'Quiz Vortex',
            images: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/quiz_padrao_preto.png`,
            locale: locale == 'pt' ? 'pt_BR' : 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: t('layout.metadataTitle'),
            description: t('selectTypePage.desc'),
            images: [`${env.NEXT_PUBLIC_DOMAIN_FRONT}/quiz_padrao_preto.png`],
        }
    }
}

export default async function CreateQuizPage({ params }: IProps) {
    const {locale} = await params
    const t = await getTranslations({ locale, namespace: 'createQuizFlow.selectTypePage' });
    const tShared = await getTranslations({ locale, namespace: 'landingPage.stylesSection' });

    return (
        <main className={styles.content}>
            <div className={styles.create_quiz_types}>
                <div>
                    <h1>{t('title')}</h1>
                    <h2>{t('desc')}</h2>
                    <p>{t('subtitle')}</p>
                </div>
                <ul>
                    <nav>
                        <li className={styles.type_actived}>
                            <Link locale={locale} href='/create/quiz/cover'>
                                <span className={styles.icon_emoji}><CloverSvg/></span>
                                <p>{tShared.rich('rightAndWrong', { span: (chunks) => <span>{chunks}</span> })}</p>
                            </Link>
                        </li>
                        <li className={styles.type_inactived}>
                            <Link href='#'>
                                <span className={styles.icon_emoji}><SmileSvg/></span>
                                <p>{tShared.rich('personality', { span: (chunks) => <span>{chunks}</span> })}</p>
                            </Link>
                            <span className={styles.soon}><SoonSvg/></span>  
                        </li>
                        <li className={styles.type_inactived}>
                            <Link href='#'>
                                <span className='iconemoji'><ListSvg/></span>
                                <p>{tShared.rich('list', { span: (chunks) => <span>{chunks}</span> })}</p>
                            </Link>
                            <span className={styles.soon}><SoonSvg/></span>
                        </li>
                        <li className={styles.type_inactived}>
                            <Link href='#'>
                                <span className={styles.icon_emoji}><StrokeProfileSvg/></span>
                                <p>{tShared.rich('aboutMe', { span: (chunks) => <span>{chunks}</span> })}</p>
                            </Link>
                            <span className={styles.soon}><SoonSvg/></span>
                        </li>
                    </nav>
                </ul>
            </div>
            <div className={styles.description_types}>
                <section>
                    <h2>{t('descriptions.rightAndWrongTitle')}</h2>
                    <p>{t('descriptions.rightAndWrongText')}</p>
                </section>
                <section>
                    <h2>{t('descriptions.personalityTitle')}</h2>
                    <p>{t('descriptions.personalityText')}</p>
                </section>
                <section>
                    <h2>{t('descriptions.imageTitle')}</h2>
                    <p>{t('descriptions.imageText')}</p>
                </section>
            </div>
        </main>
    )
}