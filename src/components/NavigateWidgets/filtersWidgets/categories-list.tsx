'use client'

import { useFilters } from '@/contexts/filtersContext'
import { TFilter } from '@/types/filtersType'
import { TStyles } from '@/types/stylesType'
import { useLocale } from 'next-intl'
import React from 'react'

interface IProps {
    styles: TStyles
    filters: TFilter[]
    setFilters: React.Dispatch<React.SetStateAction<TFilter[]>>
}

export default function CategoriesList({ styles, filters, setFilters }: IProps) {
    const { filters: categories, getCategoryLabel } = useFilters()
    const locale = useLocale()

    const verifyFilterSelect = (category: TFilter) => {
        return filters.includes(category)
    }

    const handleFilterSelected = (category: TFilter) => {
        if (verifyFilterSelect(category)) {
            setFilters(prevState => prevState.filter(filter => filter !== category))
            return
        }

        setFilters(state => [
            ...state,
            category
        ])
    }

    return (
        <ul>
            {categories.map((category) => (
                <li
                    key={category}
                    className={verifyFilterSelect(category) ? styles.active_li : ''}
                    onClick={() => handleFilterSelected(category)}
                >
                    {getCategoryLabel(category, locale)}
                </li>
            ))}
        </ul>
    )
}