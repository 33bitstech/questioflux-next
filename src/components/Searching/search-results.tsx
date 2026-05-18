'use client'

import IQuizes from '@/interfaces/IQuizes'
import { TStyles } from '@/types/stylesType'
import React, { useEffect, useMemo, useRef, useState } from 'react'
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

interface IPaginatedQuizzes {
    quizzes: IQuizes[]
    total?: number
    totalPages?: number
    page?: number
}

const getApiTypeQuiz = (typeQuiz: string) => {
    if (typeQuiz === 'Image') return 'image/RW'
    if (typeQuiz === 'Right and Wrong') return 'default/RW'

    return ''
}

export default function SearchResults({ styles, defaultQuizzes, totalPages }: IProps) {
    const t = useTranslations('explorePage.buttons')
    const { filtersSelected, typeQuizSelected } = useFilters()

    const searchParams = useSearchParams()

    const title = searchParams.get('title')?.trim() || ''
    const tags = searchParams.get('tags')?.trim() || ''
    const categoriesFromUrl = searchParams.get('categories')?.trim() || ''

    const [quizzes, setQuizzes] = useState<IQuizes[]>(defaultQuizzes)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPagesState, setTotalPagesState] = useState(totalPages)
    const [loadingMore, setLoadingMore] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)

    const firstRender = useRef(true)

    const apiTypeQuizSelected = getApiTypeQuiz(typeQuizSelected)

    const categoriesToSearch = useMemo(() => {
        const urlCategories = categoriesFromUrl
            ? categoriesFromUrl.split(',').map(category => category.trim()).filter(Boolean)
            : []

        return Array.from(new Set([...urlCategories, ...filtersSelected]))
    }, [categoriesFromUrl, filtersSelected])

    const hasBackendSearch = useMemo(() => {
        return Boolean(
            title ||
            tags ||
            categoriesToSearch.length > 0 ||
            apiTypeQuizSelected
        )
    }, [title, tags, categoriesToSearch, apiTypeQuizSelected])

    const buildSearchUrl = (page: number) => {
        const params = new URLSearchParams()

        params.set('page', String(page))

        if (title) params.set('title', title)
        if (tags) params.set('tags', tags)

        if (categoriesToSearch.length > 0) {
            params.set('categories', categoriesToSearch.join(','))
        }

        if (apiTypeQuizSelected) {
            params.set('typeQuiz', apiTypeQuizSelected)
        }

        if (hasBackendSearch) {
            return `/api/quizzes/search?${params.toString()}`
        }

        return `/api/quizzes/public?page=${page}`
    }

    const fetchQuizzes = async (page: number, replace: boolean) => {
        const response = await fetch(buildSearchUrl(page), {
            method: 'GET',
            cache: 'no-store',
        })

        const data: IPaginatedQuizzes = await response.json()

        if (!response.ok) {
            throw data
        }

        setQuizzes(prev => {
            if (replace) return data.quizzes ?? []
            return [...prev, ...(data.quizzes ?? [])]
        })

        setCurrentPage(data.page ?? page)
        setTotalPagesState(data.totalPages ?? 1)
    }

    useEffect(() => {
        setQuizzes(defaultQuizzes)
        setCurrentPage(1)
        setTotalPagesState(totalPages)
    }, [defaultQuizzes, totalPages])

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false
            return
        }

        let ignore = false

        const search = async () => {
            setSearchLoading(true)

            try {
                const response = await fetch(buildSearchUrl(1), {
                    method: 'GET',
                    cache: 'no-store',
                })

                const data: IPaginatedQuizzes = await response.json()

                if (!response.ok) {
                    throw data
                }

                if (!ignore) {
                    setQuizzes(data.quizzes ?? [])
                    setCurrentPage(data.page ?? 1)
                    setTotalPagesState(data.totalPages ?? 1)
                }
            } catch (err) {
                console.log(err)

                if (!ignore) {
                    setQuizzes([])
                    setCurrentPage(1)
                    setTotalPagesState(1)
                }
            } finally {
                if (!ignore) {
                    setSearchLoading(false)
                }
            }
        }

        search()

        return () => {
            ignore = true
        }
    }, [title, tags, categoriesToSearch, typeQuizSelected])

    const handleLoadMore = async () => {
        if (currentPage >= totalPagesState) return

        setLoadingMore(true)

        try {
            await fetchQuizzes(currentPage + 1, false)
        } catch (err) {
            console.log(err)
        } finally {
            setLoadingMore(false)
        }
    }

    const hasMore = currentPage < totalPagesState

    return (
        <>
            <LoadingQuizzes loading={searchLoading || loadingMore} />

            <div className={styles.quizes_container}>
                {quizzes.map((quiz, index) => (
                    <QuizCard key={quiz.quizId ?? index} quiz={quiz} />
                ))}
            </div>

            {hasMore && (
                <button
                    onClick={handleLoadMore}
                    disabled={loadingMore || searchLoading}
                    className={styles.seemore_button}
                >
                    <p>{t('seeMore')}</p>
                    <ArrowSvg />
                </button>
            )}
        </>
    )
}