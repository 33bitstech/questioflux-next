'use client'
import React, { useState } from 'react'
import styles from './filters-container.module.scss'
import { TFilter } from '@/types/filtersType'
import CategoriesList from './categories-list'
import { useFilters } from '@/contexts/filtersContext'
import { useTranslations } from 'next-intl'
import { TTypeQuiz } from '@/types/quizzesType'
import TypesList from './types-list'

interface IProps {
    setFilterClicked: () => void
}

const normalizeType = (type: TTypeQuiz): TTypeQuiz => {
    if (type === 'Personality') return 'All'
    return type
}

export default function FiltersContainer({ setFilterClicked }: IProps) {
    const t = useTranslations('filters')
    const { selectFilters, filtersSelected, typeQuizSelected, selectType } = useFilters()

    const [filters, setFilters] = useState<TFilter[]>(filtersSelected)
    const [typeQ, setTypeQ] = useState<TTypeQuiz>(normalizeType(typeQuizSelected))

    const handleApply = () => {
        selectFilters(filters)
        selectType(normalizeType(typeQ))
        setFilterClicked()
    }

    return (
        <div className={`${styles.filters_popup}`}>
            <div className={styles.filters_container}>
                <div className={styles.quiz_types}>
                    <p>{t('quizTypeTitle')}</p>
                    <TypesList
                        setTypeQ={setTypeQ}
                        styles={styles}
                        typeQ={typeQ}
                    />
                </div>

                <div className={styles.categories}>
                    <p>{t('categoryTitle')}</p>
                    <CategoriesList
                        styles={styles}
                        filters={filters}
                        setFilters={setFilters}
                    />
                </div>
            </div>

            <button className={styles.apply_filters} onClick={handleApply}>
                {t('applyButton')}
            </button>
        </div>
    )
}