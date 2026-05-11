'use client'
import useGettingQuiz from '@/hooks/requests/quiz-requests/useGettingQuiz'
import IQuizes from '@/interfaces/IQuizes'
import { TStyles } from '@/types/stylesType'
import React, { useEffect, useState } from 'react'
import QuizCard from '../Card/quiz-card'
import ArrowSvg from '../Icons/ArrowSvg'
import { useFilters } from '@/contexts/filtersContext'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import LoadingQuizzes from '../Loading/loading-quizzes'

interface IProps {
    styles: TStyles
    defaultQuizzes: IQuizes[]
    totalPages: number
}

export default function SearchResults({ styles, defaultQuizzes, totalPages }: IProps) {
    const t = useTranslations('explorePage.buttons')
    const { filtersSelected, typeQuizSelected } = useFilters()
    const { searchQuiz } = useGettingQuiz()

    const [allQuizzes, setAllQuizzes] = useState<IQuizes[]>(defaultQuizzes)
    const [searchResults, setSearchResults] = useState<IQuizes[] | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [loadingMore, setLoadingMore] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)

    const searchParams = useSearchParams()
    const title = searchParams.get('title') || ''
    const tags = searchParams.get('tags') || ''
    const categories = searchParams.get('categories') || ''
    const hasSearchParams = !!(title || tags || categories)

    // Resultados computados: nunca ficam desatualizados
    const getFilteredQuizzes = () => {
        let filtered = [...allQuizzes]
        if (filtersSelected.length > 0) {
            filtered = filtered.filter(q => filtersSelected.includes(q.category))
        }
        if (typeQuizSelected === 'Image') {
            filtered = filtered.filter(q => q.type === 'image/RW')
        }
        return filtered
    }

    const displayedResults = hasSearchParams
        ? (searchResults ?? [])
        : getFilteredQuizzes()

    const canLoadMore = !hasSearchParams && currentPage < totalPages

    // Busca via search endpoint (independente da paginação)
    useEffect(() => {
        if (hasSearchParams) {
            setSearchLoading(true)
            const search = async () => {
                try {
                    const res = await searchQuiz(title, categories, tags)
                    setSearchResults(res?.quizzes ?? [])
                } catch (err) {
                    console.log(err)
                } finally {
                    setSearchLoading(false)
                }
            }
            search()
        } else {
            setSearchResults(null)
        }
    }, [title, tags, categories])

    // Resetar quando os quizzes iniciais mudarem (ex: navegação)
    useEffect(() => {
        if (defaultQuizzes) {
            setAllQuizzes(defaultQuizzes)
            setCurrentPage(1)
        }
    }, [defaultQuizzes])

    const handleLoadMore = async () => {
        if (loadingMore || currentPage >= totalPages) return
        setLoadingMore(true)
        try {
            const response = await fetch(`/api/quizzes/public?page=${currentPage + 1}`)
            const data = await response.json()
            if (data?.quizzes) {
                setAllQuizzes(prev => [...prev, ...data.quizzes])
                setCurrentPage(prev => prev + 1)
            }
        } catch (err) {
            console.log(err)
        } finally {
            setLoadingMore(false)
        }
    }

    return (
        <>
            <LoadingQuizzes loading={searchLoading || loadingMore} />
            <div className={styles.quizes_container}>
                {displayedResults.map((quiz, index) => (
                    <QuizCard key={quiz.quizId ?? index} quiz={quiz} />
                ))}
            </div>

            {canLoadMore && !searchLoading && (
                <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className={styles.seemore_button}
                >
                    <p>{t('seeMore')}</p>
                    <ArrowSvg />
                </button>
            )}
        </>
    )
}