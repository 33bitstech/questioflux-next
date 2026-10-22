'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { RotateCcw, Trophy } from 'lucide-react'
import IQuizes from '@/interfaces/IQuizes'
import { IStoredExamReview, loadExamReview } from '@/utils/examReview'
import { quizParams, trackEvent } from '@/utils/analytics'
import ExamReviewView from './exam-review-view'
import styles from './exam-review.module.scss'

interface IProps {
    quiz: IQuizes
    adSlot?: string
}

// /quiz/[id]/review: lê a correção que o taking guardou nesta aba.
export default function ExamReviewPage({ quiz, adSlot }: IProps) {
    const t = useTranslations('quizResultsPage.review')
    // undefined = ainda lendo (só dá para ler o sessionStorage depois de montar)
    const [data, setData] = useState<IStoredExamReview | null | undefined>(undefined)

    useEffect(() => {
        const stored = loadExamReview(quiz.quizId)
        setData(stored)

        if (stored) {
            const correct = stored.review.filter(question => question.correct).length
            trackEvent('quiz_review_view', {
                ...quizParams(quiz),
                score: correct,
                score_percent: stored.review.length ? Math.round(correct / stored.review.length * 100) : undefined,
            })
        }
    }, [quiz])

    if (data === undefined) return null

    if (!data) {
        return (
            <div className={styles.empty}>
                <p>{t('empty')}</p>
                <Link href={`/quiz/${quiz.quizId}/taking`} className={styles.button_primary}>{t('takeExam')}</Link>
            </div>
        )
    }

    return (
        <ExamReviewView
            quizId={quiz.quizId}
            score={data.score}
            review={data.review}
            adSlot={adSlot}
            actions={<>
                <Link href={`/quiz/${quiz.quizId}/taking`} className={styles.button_primary}>
                    <RotateCcw aria-hidden="true" /> {t('retake')}
                </Link>
                <Link href={`/quiz/${quiz.quizId}/lb`} className={styles.button_secondary}>
                    <Trophy aria-hidden="true" /> {t('viewLeaderboard')}
                </Link>
            </>}
        />
    )
}
