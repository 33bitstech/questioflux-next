import React from 'react'
import styles from './page.module.scss'
import IQuizes from '@/interfaces/IQuizes';
import { env } from '@/env';
import {Link} from '@/i18n/navigation';
import Participants from '@/components/widgets/participants';
import SaveQuizWidget from '@/components/widgets/save-quiz-widget';
import ShareButton from '@/components/widgets/share-button';
import { getTranslations } from 'next-intl/server'; 
import QuizCategoryContainer from '@/components/widgets/quiz-category-container';
import GoogleAdMobile from '@/components/Google/googleAdMobile';
import { Metadata } from 'next';

interface IProps {
    params: Promise<{
        quizId: string,
        locale: string
    }>
}

const transformData = (datatime: Date, locale:string) => {
        return new Intl.DateTimeFormat(locale, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(new Date(datatime));
    }

async function getQuiz(quizId:string) : Promise<IQuizes|undefined> {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/${quizId}`, {
            method: 'GET',
            next:{revalidate: 60*5}
        });
        const res = await response.json();
        return res.quiz;
    } catch (err: any) {
        console.log(err)
    }
}

export async function generateMetadata({params}: IProps) : Promise<Metadata> {
    const {locale, quizId} = await params
    const t = await getTranslations({locale, namespace: 'quizInfoPage.metadata'})
    const quiz = await getQuiz(quizId)

    const langs = {
        'en-US': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/quiz/${quizId}`,
        'pt-BR': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/pt/quiz/${quizId}`,
        'x-default': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/quiz/${quizId}`
    },
    names = {
        name:quiz?.userCreatorName ?? '',
        quiz_name: quiz?.title ?? ''
    }

    if(!quiz) return {title: 'null'}

    return {
        title: t('title', names),
        description: t('desc', names),
        robots: `${quiz.isPrivate ? '': 'index, follow'}`,
        keywords: "quiz, user, take, save, share",
        alternates:{
            canonical: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/quiz/${quizId}`,
            languages: langs
        },
        openGraph: {
            title: t('title', names),
            description: t('desc', names),
            url: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/quiz/${quizId}`, 
            siteName: 'Quiz Vortex',
            images: quiz?.quizThumbnail ?? `${env.NEXT_PUBLIC_DOMAIN_FRONT}/quiz_padrao_preto.png`,
        },
        twitter: {
            title: t('title', names),
            description: t('desc', names),
            images: [quiz?.quizThumbnail ?? `${env.NEXT_PUBLIC_DOMAIN_FRONT}/quiz_padrao_preto.png`],
        }
    }
}

export default async function Quiz({params}: IProps) {
    const {quizId, locale} = await params;
    const t = await getTranslations({ locale, namespace: 'quizInfoPage' });
    const quiz = await getQuiz(quizId);

    if(!quiz) return null

    const quizSchema = {
        "@context": "https://schema.org",
        "@type": "Quiz",
        "mainEntityOfPage": { "@id": `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/quiz/${quizId}` },
        "name": quiz.title,
        "description": quiz.description,
        "author": {
            "@type": "Person",
            "@id": `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/user/${quiz?.userCreatorId}#person`,
            "name": quiz.userCreatorName
        },
        "publisher": { "@id": `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/#organization` },
        "potentialAction": [
            {
                "@type": "TakeAction",
                "name": t('metadata.actions.take'),
                "target": `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/quiz/${quiz.quizId}/taking`
            }
        ]
    }

    return (
        <>
            <GoogleAdMobile left={true}/>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(quizSchema) }}
            />

            <div className={styles.quiz_details}>
                <div className={styles.info}>
                    <h3>{t('title')}</h3>
                    <ul>
                        {quiz && (
                            <>
                                <li>{t('details.createdBy')} <Link href={`/user/${quiz?.userCreatorId}`}>{quiz.userCreatorName}</Link></li>
                                <li>{t('details.creationDate')} <time dateTime={quiz.created_at.toString()}>{transformData(quiz.created_at, locale)}</time></li>
                                <li>{t('details.lastUpdated')} <time dateTime={quiz.updated_at.toString()}>{transformData(quiz.updated_at, locale)}</time></li>
                                <li>{t('details.participants')} <Participants quiz={quiz} styles={styles}/></li>
                                <li>{t('details.category')} 
                                    <QuizCategoryContainer
                                        quiz={quiz}
                                    />
                                </li>
                                {quiz?.tags && quiz.tags.length > 0 ? <li>
                                    {t('details.tags')} { quiz.tags?.map((tag, i)=>(
                                        <span key={i}>
                                            <strong>{tag}</strong>{quiz.tags && i < (quiz.tags.length-1) ? ', ' : ''}
                                        </span>
                                    )) }
                                </li> : <></>}
                            </>
                        )}
                    </ul>
                </div>
                <div className={styles.actions}>
                    <Link locale={locale} href={`/quiz/${quizId}/taking`}>{t('ctaButton')}</Link>
                    <SaveQuizWidget quizId={quizId} />
                    <ShareButton styles={styles} quizId={quizId}/>
                </div>
                <div className={styles.description_container}>
                    <h2>{quiz?.description}</h2>
                </div>
            </div>
            <GoogleAdMobile right={true} />
            
            <footer className={styles.footer}></footer>
        </>
    )
}