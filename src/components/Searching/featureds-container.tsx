'use client'
import { TStyles } from '@/types/stylesType'
import React, { useState } from 'react'
import QuizCard from '../Card/quiz-card'
import IQuizes from '@/interfaces/IQuizes'
import { useTranslations } from 'next-intl'
import ArrowSvg from '../Icons/ArrowSvg'

interface IProps {
    styles: TStyles
    defaultQuizzes: IQuizes[]
}

// Os mais populares, no topo do Explorar (a página só mostra sem filtro nem busca)
export default function FeaturedsContainer({ styles, defaultQuizzes }: IProps) {
    const t = useTranslations('explorePage')
    const tButtons = useTranslations('explorePage.buttons')

    const [showAll, setShowAll] = useState(false)

    if (defaultQuizzes.length === 0) return null

    const displayQuizzes = showAll ? defaultQuizzes : defaultQuizzes.slice(0, 3)
    const hasMore = defaultQuizzes.length > 3

    return (
        <section className={styles.results}>
            <h2 className={styles.featured_title}>{t('featuredTitle')}</h2>
            <div className={styles.quizes_container}>
                {displayQuizzes.map((quiz, index) => (
                    <QuizCard key={quiz.quizId ?? index} quiz={quiz} />
                ))}
            </div>
            {hasMore && (
                <button
                    type="button"
                    onClick={() => setShowAll(prev => !prev)}
                    aria-expanded={showAll}
                    className={`${styles.seemore_button} ${showAll ? styles.active : ''}`}
                >
                    <p>{showAll ? tButtons('seeLess') : tButtons('seeMore')}</p>
                    <ArrowSvg />
                </button>
            )}
        </section>
    )
}
