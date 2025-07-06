import {Link} from '@/i18n/navigation'
import React from 'react'
import styles from './create-quiz-page.module.scss'
import SmileSvg from '@/components/Icons/SmileSvg'
import CloverSvg from '@/components/Icons/CloverSvg'
import SoonSvg from '@/components/Icons/SoonSvg'
import ListSvg from '@/components/Icons/ListSvg'
import StrokeProfileSvg from '@/components/Icons/StrokeProfileSvg'
import { getTranslations } from 'next-intl/server'

interface IProps {
    params: Promise<{ locale: string }>;
}

export default async function CreateQuizPage({ params }: IProps) {
    const {locale} = await params
    const t = await getTranslations({ locale, namespace: 'createQuizFlow.selectTypePage' });
    const tShared = await getTranslations({ locale, namespace: 'landingPage.stylesSection' });

    return (
        <main className={styles.content}>
            <div className={styles.create_quiz_types}>
                <h1>{t('title')}</h1>
                <p>{t('subtitle')}</p>
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