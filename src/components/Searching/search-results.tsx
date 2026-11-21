'use client'

import IQuizes from '@/interfaces/IQuizes'
import { TStyles } from '@/types/stylesType'
import React, { useEffect, useState } from 'react'
import QuizCard from '../Card/quiz-card'
import ArrowSvg from '../Icons/ArrowSvg'
import { useTranslations } from 'next-intl'
import LoadingQuizzes from '../Loading/loading-quizzes'
import { Link } from '@/i18n/navigation'
import { exploreApiPath, exploreHref, IExploreFilters } from '@/utils/exploreFilters'

interface IProps {
    styles: TStyles
    // a página pedida no endereço, já filtrada pelo servidor
    defaultQuizzes: IQuizes[]
    filters: IExploreFilters
    totalPages: number
}

interface IPaginatedQuizzes {
    quizzes: IQuizes[]
    total?: number
    totalPages?: number
    page?: number
}

// Lista do Explorar. Os filtros vêm do endereço (o servidor manda a lista pronta); "Ver mais"
// é um link para a próxima página: com JavaScript ela entra embaixo desta, sem ele (ou para
// o Google) o link abre a página seguinte.
export default function SearchResults({ styles, defaultQuizzes, filters, totalPages }: IProps) {
    const t = useTranslations('explorePage')

    const [quizzes, setQuizzes] = useState<IQuizes[]>(defaultQuizzes)
    const [currentPage, setCurrentPage] = useState(filters.page)
    const [totalPagesState, setTotalPagesState] = useState(totalPages)
    const [loadingMore, setLoadingMore] = useState(false)

    // filtro novo ou outra página no endereço: a lista recomeça com o que veio do servidor
    useEffect(() => {
        setQuizzes(defaultQuizzes)
        setCurrentPage(filters.page)
        setTotalPagesState(totalPages)
    }, [defaultQuizzes, filters.page, totalPages])

    const handleLoadMore = async (event: React.MouseEvent<HTMLAnchorElement>) => {
        // abrir em outra aba continua funcionando como link
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
        event.preventDefault()
        if (loadingMore || currentPage >= totalPagesState) return

        setLoadingMore(true)
        try {
            const response = await fetch(exploreApiPath(filters, currentPage + 1), { method: 'GET', cache: 'no-store' })
            const data: IPaginatedQuizzes = await response.json()
            if (!response.ok) throw data

            setQuizzes(prev => [...prev, ...(data.quizzes ?? [])])
            setCurrentPage(data.page ?? currentPage + 1)
            setTotalPagesState(data.totalPages ?? totalPagesState)
        } catch (err) {
            console.log(err)
        } finally {
            setLoadingMore(false)
        }
    }

    const hasMore = currentPage < totalPagesState

    return (
        <>
            {filters.page > 1 && (
                <Link href={exploreHref({ ...filters, page: filters.page - 1 })} rel="prev" className={styles.previous_page}>
                    {t('buttons.previousPage')}
                </Link>
            )}

            {quizzes.length === 0 && (
                <p className={styles.no_results}>
                    {t('noResults')} <Link href="/explore">{t('clearFilters')}</Link>
                </p>
            )}

            <div className={styles.quizes_container}>
                {quizzes.map((quiz, index) => (
                    <QuizCard key={quiz.quizId ?? index} quiz={quiz} />
                ))}
            </div>

            <LoadingQuizzes loading={loadingMore} />

            {hasMore && (
                <Link
                    href={exploreHref({ ...filters, page: currentPage + 1 })}
                    onClick={handleLoadMore}
                    rel="next"
                    scroll={false}
                    aria-busy={loadingMore}
                    className={styles.seemore_button}
                >
                    <p>{t('buttons.seeMore')}</p>
                    <ArrowSvg />
                </Link>
            )}
        </>
    )
}
