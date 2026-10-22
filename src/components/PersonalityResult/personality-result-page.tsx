'use client'
import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ListChecks, RotateCcw } from 'lucide-react'
import IQuizes from '@/interfaces/IQuizes'
import IPersonalityOutcome from '@/interfaces/IPersonalityOutcome'
import { loadPersonalityOutcome } from '@/utils/personalityOutcome'
import { quizParams, trackEvent } from '@/utils/analytics'
import PersonalityResultView from './personality-result-view'
import styles from './personality-result.module.scss'

interface IProps {
    quiz: IQuizes
    shareUrl: string
}

// /quiz/[id]/personality: lê o resultado que o taking guardou nesta aba.
export default function PersonalityResultPage({ quiz, shareUrl }: IProps) {
    const t = useTranslations('personalityResultPage')
    const locale = useLocale()
    // undefined = ainda lendo (o sessionStorage só existe depois de montar)
    const [outcome, setOutcome] = useState<IPersonalityOutcome | null | undefined>(undefined)

    useEffect(() => {
        const stored = loadPersonalityOutcome(quiz.quizId)
        setOutcome(stored)

        if (stored) {
            trackEvent('quiz_result_view', {
                ...quizParams(quiz),
                personality_result: stored.result.title.slice(0, 100),
            })
        }
    }, [quiz])

    if (outcome === undefined) return null

    if (!outcome) {
        return (
            <div className={styles.empty}>
                <p>{t('empty')}</p>
                <Link href={`/quiz/${quiz.quizId}/taking`} className={styles.button_primary}>{t('takeQuiz')}</Link>
            </div>
        )
    }

    return (
        <PersonalityResultView
            quizId={quiz.quizId}
            quizTitle={quiz.title}
            outcome={outcome}
            shareUrl={shareUrl}
            actions={<>
                <Link href={`/quiz/${quiz.quizId}/taking`} className={styles.button_primary}>
                    <RotateCcw aria-hidden="true" /> {t('retake')}
                </Link>
                <Link href={`/quiz/${quiz.quizId}/leaderboard`} locale={locale} className={styles.button_secondary}>
                    <ListChecks aria-hidden="true" /> {t('allResults')}
                </Link>
            </>}
        />
    )
}
