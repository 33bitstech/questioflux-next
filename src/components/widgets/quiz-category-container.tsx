'use client'

import { useFilters } from '@/contexts/filtersContext'
import IQuizes from '@/interfaces/IQuizes'
import { TFilter } from '@/types/filtersType'
import { useLocale } from 'next-intl'

interface IProps {
    quiz: IQuizes
}

export default function QuizCategoryContainer({ quiz }: IProps) {
    const { getCategoryLabel } = useFilters()
    const locale = useLocale()

    return (
        <span>
            {' '}
            {getCategoryLabel(quiz.category as TFilter, locale)}
        </span>
    )
}