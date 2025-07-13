'use client'
import React, { useState } from 'react'
import styles from './filters-container.module.scss'
import { TFilter } from '@/types/filtersType'
import CategoriesList from './categories-list'
import { useFilters } from '@/contexts/filtersContext'
import { useTranslations } from 'next-intl' // 1. Importar o hook
import { TTypeQuiz } from '@/types/quizzesType'
import TypesList from './types-list'

interface IProps{
    setFilterClicked: () => void
}

export default function FiltersContainer({setFilterClicked}: IProps) {
    const t = useTranslations('filters'); // 2. Inicializar o hook
    const {selectFilters, filtersSelected, typeQuizSelected, selectType} = useFilters();

    const [filters, setFilters] = useState<TFilter[]>(filtersSelected),
        [typeQ, setTypeQ] = useState<TTypeQuiz>(typeQuizSelected)

    const handleApply = ()=>{
        if (filters) selectFilters(filters)
        if (typeQ) selectType(typeQ)
        setFilterClicked()
    }

    return (
        <div className={`${styles.filters_popup}`}>
            <div className={styles.filters_container}>
                {/* 3. Usar as traduções */}
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
                    <CategoriesList styles={styles} filters={filters} setFilters={setFilters}/>
                </div>
            </div>
            <button className={styles.apply_filters} onClick={handleApply}>{t('applyButton')}</button>
        </div>
    )
}