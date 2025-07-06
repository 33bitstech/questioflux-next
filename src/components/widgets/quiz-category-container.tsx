'use client'
import { useFilters } from '@/contexts/filtersContext'
import IQuizes from '@/interfaces/IQuizes'
import { useLocale } from 'next-intl'
import React from 'react'

interface IProps{
    quiz: IQuizes
}

export default function QuizCategoryContainer({quiz}: IProps) {
    const {filtersPt, filters} = useFilters(),
        locale = useLocale()
    return (
        <span>
            {locale == 'pt' ?
                ` ${filtersPt[filters.indexOf(quiz.category)]}`
                :
                ` ${quiz.category}`
            }
        </span>
    )
}
