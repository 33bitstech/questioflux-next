'use client'
import React, { useState } from 'react'
import styles from './filters-container.module.scss'
import { TFilter } from '@/types/filtersType'
import CategoriesList from './categories-list'
import { useFilters } from '@/contexts/filtersContext'
import { useTranslations } from 'next-intl' // 1. Importar o hook

interface IProps{
    setFilterClicked: () => void
}

export default function FiltersContainer({setFilterClicked}: IProps) {
    const t = useTranslations('filters'); // 2. Inicializar o hook
    const {selectFilters, filtersSelected} = useFilters();
    const [filters, setFilters] = useState<TFilter[]>(filtersSelected);

    const handleApply = ()=>{
        if (filters) {
            selectFilters(filters)
            setFilterClicked()
        }
    }

    return (
        <div className={`${styles.filters_popup}`}>
            <div className={styles.filters_container}>
                {/* 3. Usar as traduções */}
                <div className={styles.quiz_types}>
                    <p>{t('quizTypeTitle')}</p>
                    <ul>
                        <li className={styles.active_li}>{t('quizTypes.all')}</li>
                        <li className={`${styles.types_soon}`}>{t('quizTypes.personality')}</li>
                        <li className={`${styles.types_soon}`}>{t('quizTypes.image')}</li>
                        <li className={`${styles.types_soon}`}>{t('quizTypes.rightAndWrong')}</li>
                    </ul>
                </div>
                <div className={styles.categories}>
                    <p>{t('categoryTitle')}</p>
                    {/* O componente CategoriesList é renderizado aqui */}
                    <CategoriesList styles={styles} filters={filters} setFilters={setFilters}/>
                </div>
            </div>
            <button className={styles.apply_filters} onClick={handleApply}>{t('applyButton')}</button>
        </div>
    )
}