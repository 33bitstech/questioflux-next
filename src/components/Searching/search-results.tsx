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

const ITEMS_PER_VIEW = 9

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
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_VIEW)
    const [currentPage, setCurrentPage] = useState(1)
    const [loadingMore, setLoadingMore] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)

    const searchParams = useSearchParams()
    const title = searchParams.get('title') || ''
    const tags = searchParams.get('tags') || ''
    const categories = searchParams.get('categories') || ''
    const hasSearchParams = !!(title || tags || categories)

    const getFilteredQuizzes = () => {
        let filtered = [...allQuizzes]
        if (filtersSelected.length > 0)
            filtered = filtered.filter(q => filtersSelected.includes(q.category))
        if (typeQuizSelected === 'Image')
            filtered = filtered.filter(q => q.type === 'image/RW')
        return filtered
    }

    const allFiltered = hasSearchParams ? (searchResults ?? []) : getFilteredQuizzes()
    const displayedResults = allFiltered.slice(0, visibleCount)

    const hasMore = !hasSearchParams && (
        allFiltered.length > visibleCount || currentPage < totalPages
    )

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

    useEffect(() => {
        if (defaultQuizzes) {
            setAllQuizzes(defaultQuizzes)
            setVisibleCount(ITEMS_PER_VIEW)
            setCurrentPage(1)
        }
    }, [defaultQuizzes])

    const handleLoadMore = async () => {
        const nextVisible = visibleCount + ITEMS_PER_VIEW

        if (nextVisible <= allQuizzes.length) {
            setVisibleCount(nextVisible)
            return
        }

        if (currentPage < totalPages) {
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

        setVisibleCount(nextVisible)
    }

    return (
        <>
            <LoadingQuizzes loading={searchLoading || loadingMore} />
            <div className={styles.quizes_container}>
                {displayedResults.map((quiz, index) => (
                    <QuizCard key={quiz.quizId ?? index} quiz={quiz} />
                ))}
            </div>

            {hasMore && (
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