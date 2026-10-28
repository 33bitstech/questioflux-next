'use client'
import { ReactNode, useMemo, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Check, X } from 'lucide-react'
import IExamReviewQuestion from '@/interfaces/IExamReview'
import type { IQuizScore } from '@/components/TakingQuiz/taking'
import { getTimeString } from '@/utils/FormatTime'
import { trackEvent } from '@/utils/analytics'
import GoogleAd from '@/components/Google/GoogleAd'
import styles from './exam-review.module.scss'

type TFilter = 'all' | 'wrong' | 'right'

interface IProps {
    quizId: string
    score: IQuizScore
    review: IExamReviewQuestion[]
    // botões abaixo do resumo (refazer, ranking...)
    actions?: ReactNode
    // anúncio no meio da lista; o embed não passa (fica dentro do site de outra pessoa)
    adSlot?: string
    // título acima da nota; sem ele, "Correção da prova"
    heading?: string
    // false fora da prova: só a alternativa escolhida e se acertou, sem a etiqueta "Resposta correta"
    showCorrectTag?: boolean
}

const AD_AFTER_QUESTION = 3
const MIN_QUESTIONS_FOR_AD = 6

// Correção da prova: nota, o que a pessoa marcou, a alternativa certa e as explicações.
export default function ExamReviewView({ quizId, score, review, actions, adSlot, heading, showCorrectTag = true }: IProps) {
    const t = useTranslations('quizResultsPage.review')
    const [filter, setFilter] = useState<TFilter>('all')

    const total = review.length
    const correct = review.filter(question => question.correct).length
    const percent = total ? Math.round(correct / total * 100) : 0
    const time = getTimeString(score.userForLeaderBoard?.timing ?? 0)

    // o número da questão é o da prova, mesmo com filtro
    const numbered = useMemo(() => review.map((question, index) => ({ question, number: index + 1 })), [review])
    const visible = numbered.filter(({ question }) =>
        filter === 'all' || (filter === 'right' ? question.correct : !question.correct))

    const counts: Record<TFilter, number> = { all: total, wrong: total - correct, right: correct }

    const changeFilter = (next: TFilter) => {
        setFilter(next)
        trackEvent('quiz_review_filter', { quiz_id: quizId, filter: next })
    }

    return (
        <section className={styles.review}>
            {/* div, não header: o layout do site posiciona todo <header> como a barra do topo */}
            <div className={styles.summary}>
                <div
                    className={styles.score_ring}
                    style={{ ['--percent' as string]: percent }}
                    role="img"
                    aria-label={t('correctCount', { correct, total })}
                >
                    <strong>{correct}/{total}</strong>
                    <span>{percent}%</span>
                </div>
                <div className={styles.summary_text}>
                    <span className={styles.eyebrow}>{heading ?? t('title')}</span>
                    {score.message && <h2>{score.message}</h2>}
                    <ul className={styles.stats}>
                        <li><Check aria-hidden="true" /> {t('correctCount', { correct, total })}</li>
                        <li>{t('totalTime')}: <time>{time}</time></li>
                    </ul>
                </div>
            </div>

            {actions && <div className={styles.actions}>{actions}</div>}

            <div className={styles.filters} role="group" aria-label={t('filters.label')}>
                {(['all', 'wrong', 'right'] as TFilter[]).map(option => (
                    <button
                        key={option}
                        type="button"
                        aria-pressed={filter === option}
                        className={filter === option ? styles.filter_active : ''}
                        onClick={() => changeFilter(option)}
                    >
                        {t(`filters.${option}`, { count: counts[option] })}
                    </button>
                ))}
            </div>

            {visible.length === 0 && <p className={styles.none}>{t('noneInFilter')}</p>}

            <ol className={styles.questions}>
                {visible.map(({ question, number }, position) => (
                    <li key={question.questionId} className={question.correct ? styles.question_right : styles.question_wrong}>
                        <article>
                            <div className={styles.question_header}>
                                <span>{t('questionLabel', { number })}</span>
                                <span className={styles.status}>
                                    {question.correct ? <Check aria-hidden="true" /> : <X aria-hidden="true" />}
                                    {question.correct ? t('right') : t('wrong')}
                                </span>
                            </div>

                            <h3>{question.question}</h3>

                            {question.image && (
                                <div className={styles.question_image}>
                                    <Image
                                        src={question.image}
                                        alt={t('questionImageAlt', { number })}
                                        width={720}
                                        height={720}
                                        sizes="(max-width: 700px) 92vw, 640px"
                                    />
                                </div>
                            )}

                            <ul className={styles.answers}>
                                {question.answers.map((answer, index) => {
                                    const chosen = answer.answer === question.userAnswer
                                    const stateClass = answer.correct ? styles.answer_correct : chosen ? styles.answer_chosen : ''
                                    const label = answer.text?.trim() || t('alternative', { number: index + 1 })

                                    return (
                                        <li key={answer.answer} className={stateClass}>
                                            <div className={styles.answer_row}>
                                                <span className={styles.marker} aria-hidden="true">
                                                    {answer.correct ? <Check /> : chosen ? <X /> : String.fromCharCode(65 + index)}
                                                </span>
                                                {answer.thumbnail && (
                                                    <Image
                                                        className={styles.thumbnail}
                                                        src={answer.thumbnail}
                                                        alt={t('alternativeImageAlt', { number: index + 1 })}
                                                        width={96}
                                                        height={96}
                                                    />
                                                )}
                                                <span className={styles.answer_text}>{label}</span>
                                                <span className={styles.tags}>
                                                    {chosen && <em className={styles.tag_chosen}>{t('yourAnswer')}</em>}
                                                    {answer.correct && showCorrectTag && <em className={styles.tag_correct}>{t('correctAnswer')}</em>}
                                                </span>
                                            </div>
                                            {answer.explanation && <p className={styles.explanation}>{answer.explanation}</p>}
                                        </li>
                                    )
                                })}
                            </ul>
                        </article>

                        {adSlot && filter === 'all' && total >= MIN_QUESTIONS_FOR_AD && position === AD_AFTER_QUESTION - 1 && (
                            <div className={styles.ad}><GoogleAd slot={adSlot} /></div>
                        )}
                    </li>
                ))}
            </ol>
        </section>
    )
}
