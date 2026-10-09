import React from 'react'
import styles from './page.module.scss'
import IQuizes from '@/interfaces/IQuizes';
import { env } from '@/env';
import { Link } from '@/i18n/navigation';
import Participants from '@/components/widgets/participants';
import SaveQuizWidget from '@/components/widgets/save-quiz-widget';
import ShareButton from '@/components/widgets/share-button';
import { getTranslations } from 'next-intl/server';
import QuizCategoryContainer from '@/components/widgets/quiz-category-container';
import GoogleAdMobile from '@/components/Google/googleAdMobile';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EmbedQuizPopup from '@/components/widgets/embed-quiz-popup';
import { getPublicQuiz, getRelatedQuizzes, withoutQuestions } from '@/utils/publicQuiz';
import { isQuizIndexable } from '@/utils/quizQuality';
import { buildQuestionsPreview, IPreviewQuestion } from '@/utils/quizPreview';
import { idiomToLanguageTag, jsonLd, quizCanonicalUrl, quizImageUrl, SITE_URL } from '@/utils/seo';
import { getOpenGraphLocale } from '@/utils/locale';
import { quizParams } from '@/utils/analytics';
import { TrackedDetails, TrackedLink, TrackOnView } from '@/components/Google/analytics-widgets';

interface IProps {
    params: Promise<{
        quizId: string,
        locale: string
    }>
}

const transformData = (datatime: Date, locale: string) => {
    return new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date(datatime));
}

function generateQuizSchema(t: any, quiz: IQuizes, questions: IPreviewQuestion[], locale: string, exploreLabel: string) {
    const url = quizCanonicalUrl(quiz)

    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Quiz",
                "@id": `${url}#quiz`,
                "url": url,
                "mainEntityOfPage": { "@id": url },
                "name": quiz.title,
                "description": quiz.description,
                "inLanguage": idiomToLanguageTag(quiz.idiom),
                "image": {
                    "@type": "ImageObject",
                    "url": quizImageUrl(quiz)
                },
                "author": {
                    "@type": "Person",
                    "@id": `${SITE_URL}/${locale}/user/${quiz.userCreatorId}#person`,
                    "name": quiz.userCreatorName,
                    "url": `${SITE_URL}/${locale}/user/${quiz.userCreatorId}`
                },
                "publisher": { "@id": `${SITE_URL}/#organization` },
                "dateCreated": quiz.created_at,
                "dateModified": quiz.updated_at,
                ...(quiz.tags?.length ? { "keywords": quiz.tags.join(', ') } : {}),
                // Só o enunciado e as alternativas: nenhuma é marcada como acceptedAnswer.
                "hasPart": questions.map(question => ({
                    "@type": "Question",
                    "eduQuestionType": "Multiple choice",
                    "name": question.text,
                    ...(question.image ? { "image": question.image } : {}),
                    "suggestedAnswer": question.options.map((option, index) => ({
                        "@type": "Answer",
                        "position": index + 1,
                        ...(option.text ? { "text": option.text } : {}),
                        ...(option.image ? { "image": option.image } : {})
                    }))
                })),
                "potentialAction": [
                    {
                        "@type": "TakeAction",
                        "name": t('metadata.actions.take'),
                        "target": `${url}/taking`
                    }
                ]
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "QuestioFlux", "item": `${SITE_URL}/${locale}` },
                    { "@type": "ListItem", "position": 2, "name": exploreLabel, "item": `${SITE_URL}/${locale}/explore` },
                    { "@type": "ListItem", "position": 3, "name": quiz.title }
                ]
            }
        ]
    }
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const { locale, quizId } = await params
    const quiz = await getPublicQuiz(quizId)

    if (!quiz) notFound()

    const t = await getTranslations({ locale, namespace: 'quizInfoPage.metadata' })

    const quizName = quiz.title.trim()
    // "Naruto" vira "Naruto – Quiz": quem procura digita "quiz de ..."
    const title = /quiz/i.test(quizName) || quizName.length > 50
        ? t('title', { quiz_name: quizName })
        : t('titleQuiz', { quiz_name: quizName })

    const rawDescription = (quiz.description ?? '').replace(/\s+/g, ' ').trim()
    // descrição curta demais para virar snippet: completa com um texto fixo
    const description = rawDescription.length >= 110
        ? rawDescription
        : `${rawDescription}${/[.!?…]$/.test(rawDescription) ? '' : '.'} ${t('descSuffix', { count: quiz.qtdQuestions })}`

    const canonical = quizCanonicalUrl(quiz)
    const image = quizImageUrl(quiz)

    return {
        title,
        description,
        robots: isQuizIndexable(quiz)
            ? { index: true, follow: true, 'max-image-preview': 'large' }
            : { index: false, follow: true },
        keywords: quiz.tags?.length ? quiz.tags : undefined,
        alternates: {
            canonical
        },
        openGraph: {
            title,
            description,
            url: canonical,
            siteName: 'QuestioFlux',
            images: image,
            locale: getOpenGraphLocale(locale),
            type: 'website'
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
        }
    }
}

export default async function Quiz({ params }: IProps) {
    const { quizId, locale } = await params;
    const quiz = await getPublicQuiz(quizId);

    if (!quiz) notFound()

    const [t, tHeader, related] = await Promise.all([
        getTranslations({ locale, namespace: 'quizInfoPage' }),
        getTranslations({ locale, namespace: 'contextualHeader' }),
        getRelatedQuizzes(quiz)
    ])

    const questions = buildQuestionsPreview(quiz)
    const quizSchema = generateQuizSchema(t, quiz, questions, locale, tHeader('explore'))
    // client components só recebem os dados do quiz, sem as questões
    const quizInfo = withoutQuestions(quiz)
    const analyticsParams = quizParams(quiz)

    return (
        <>
            <GoogleAdMobile left={true} slot='6584414246' />

            <TrackOnView event='quiz_view' params={analyticsParams} />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: jsonLd(quizSchema) }}
            />

            <div className={styles.quiz_details}>
                <div className={styles.info}>
                    <div className={styles.info_header}>
                        <h3>{t('title')}</h3>

                        <EmbedQuizPopup
                            styles={styles}
                            quizId={quizId}
                            locale={locale}
                            domain={env.NEXT_PUBLIC_DOMAIN_FRONT}
                            quizTitle={quiz.title}
                        />
                    </div>
                    <ul>
                        <li>{t('details.createdBy')} <Link locale={locale} href={`/user/${quiz.userCreatorId}`}>{quiz.userCreatorName}</Link></li>
                        <li>{t('details.creationDate')} <time dateTime={quiz.created_at.toString()}>{transformData(quiz.created_at, locale)}</time></li>
                        <li>{t('details.lastUpdated')} <time dateTime={quiz.updated_at.toString()}>{transformData(quiz.updated_at, locale)}</time></li>
                        <li>{t('details.participants')} <Participants quiz={quizInfo} styles={styles} /></li>
                        <li>{t('details.category')}
                            <QuizCategoryContainer
                                quiz={quizInfo}
                            />
                        </li>
                        {quiz.tags && quiz.tags.length > 0 ? <li>
                            {t('details.tags')} {quiz.tags.map((tag, i) => (
                                <span key={i}>
                                    <strong>{tag}</strong>{quiz.tags && i < (quiz.tags.length - 1) ? ', ' : ''}
                                </span>
                            ))}
                        </li> : <></>}
                    </ul>
                </div>
                <div className={styles.actions}>
                    <Link locale={locale} href={`/quiz/${quizId}/taking`}>{t('ctaButton')}</Link>
                    <SaveQuizWidget quizId={quizId} />
                    <ShareButton styles={styles} quizId={quizId} />
                </div>
                <div className={styles.description_container}>
                    <p>{quiz.description}</p>
                </div>

                {questions.length > 0 && (
                    <section className={styles.questions_preview}>
                        <h2>{t('questions.title')}</h2>
                        <TrackedDetails event='quiz_questions_preview' params={analyticsParams}>
                            <summary>{t('questions.summary', { count: questions.length })}</summary>
                            <p className={styles.questions_note}>{t('questions.note')}</p>
                            <ol>
                                {questions.map(question => (
                                    <li key={question.id}>
                                        <h3>{question.text}</h3>
                                        {question.image && (
                                            // <img> direto: o Google Imagens indexa a URL original do S3
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                className={styles.question_image}
                                                src={question.image}
                                                alt={`${question.text} – ${quiz.title}`}
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        )}
                                        <ul className={question.options.some(option => option.image) ? styles.options_images : undefined}>
                                            {question.options.map((option, index) => (
                                                <li key={index}>
                                                    {option.image && (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={option.image}
                                                            alt={option.text || t('questions.option', { number: index + 1 })}
                                                            loading="lazy"
                                                            decoding="async"
                                                        />
                                                    )}
                                                    {option.text && <span>{option.text}</span>}
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ol>
                        </TrackedDetails>
                    </section>
                )}

                {related.length > 1 && (
                    <section className={styles.related}>
                        <h2>{t('related.title')}</h2>
                        <ul>
                            {related.map(relatedQuiz => (
                                <li key={relatedQuiz.quizId}>
                                    <TrackedLink
                                        event='select_content'
                                        params={{ content_type: 'related_quiz', item_id: relatedQuiz.quizId, quiz_id: quizId }}
                                        locale={locale}
                                        href={`/quiz/${relatedQuiz.quizId}`}
                                    >
                                        <strong>{relatedQuiz.title}</strong>
                                        <span>{t('related.count', { count: relatedQuiz.qtdQuestions })}</span>
                                    </TrackedLink>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
            <GoogleAdMobile right={true} slot='2713167869' />

            <footer className={styles.footer}></footer>
        </>
    )
}
