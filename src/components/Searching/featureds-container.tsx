'use client'
import { TStyles } from '@/types/stylesType'
import React, { useState } from 'react'
import QuizCard from '../Card/quiz-card'
import { useSearchParams } from 'next/navigation'
import IQuizes from '@/interfaces/IQuizes'
import { useFilters } from '@/contexts/filtersContext'
import { useTranslations } from 'next-intl'
import ArrowSvg from '../Icons/ArrowSvg'

interface IProps {
    styles: TStyles
    defaultQuizzes: IQuizes[]
}

export default function FeaturedsContainer({ styles, defaultQuizzes }: IProps) {
    const t = useTranslations('explorePage')
    const tButtons = useTranslations('explorePage.buttons')

    const sp = useSearchParams()
    const isSearching = sp.size > 0
    const { filtersSelected, typeQuizSelected } = useFilters()

    const [showAll, setShowAll] = useState(false)

    if (isSearching || filtersSelected.length > 0 || typeQuizSelected !== 'All') return null

    const displayQuizzes = showAll ? defaultQuizzes : defaultQuizzes.slice(0, 3)
    const hasMore = defaultQuizzes.length > 3

    return (
        <div className={styles.results}>
            <h3>{t('featuredTitle')}</h3>
            <div className={styles.quizes_container}>
                {displayQuizzes.map((quiz, index) => (
                    <QuizCard key={quiz.quizId ?? index} quiz={quiz} />
                ))}
            </div>
            {hasMore && (
                <button
                    onClick={() => setShowAll(prev => !prev)}
                    className={`${styles.seemore_button} ${showAll ? styles.active : ''}`}
                >
                    <p>{showAll ? tButtons('seeLess') : tButtons('seeMore')}</p>
                    <ArrowSvg />
                </button>
            )}
        </div>
    )
}