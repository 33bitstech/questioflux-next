'use client'
import { TStyles } from '@/types/stylesType'
import React, { useState } from 'react'
import QuizCard from '../Card/quiz-card'
import { useSearchParams } from 'next/navigation'
import IQuizes from '@/interfaces/IQuizes'
import { useFilters } from '@/contexts/filtersContext'
import { useTranslations } from 'next-intl'
import LoadingQuizzes from '../Loading/loading-quizzes'
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

    const [popular, setPopular] = useState<IQuizes[]>(defaultQuizzes ?? [])
    const [showAll, setShowAll] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleToggle = async () => {
        if (!showAll) {
            // Faz requisição para buscar todos os populares
            setLoading(true)
            try {
                const response = await fetch('/api/quizzes/featured')
                const data = await response.json()
                if (data?.quizzes) setPopular(data.quizzes)
                setShowAll(true)
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        } else {
            setShowAll(false)
        }
    }

    if (isSearching || filtersSelected.length > 0 || typeQuizSelected !== 'All') return null

    const displayQuizzes = showAll ? popular : popular.slice(0, 3)
    const hasMore = popular.length > 3 || !showAll

    return (
        <div className={styles.results}>
            <h3>{t('featuredTitle')}</h3>
            <LoadingQuizzes loading={loading} />
            <div className={styles.quizes_container}>
                {displayQuizzes.map((quiz, index) => (
                    <QuizCard key={quiz.quizId ?? index} quiz={quiz} />
                ))}
            </div>
            {hasMore && (
                <button
                    onClick={handleToggle}
                    disabled={loading}
                    className={`${styles.seemore_button} ${showAll ? styles.active : ''}`}
                >
                    <p>{showAll ? tButtons('seeLess') : tButtons('seeMore')}</p>
                    <ArrowSvg />
                </button>
            )}
        </div>
    )
}