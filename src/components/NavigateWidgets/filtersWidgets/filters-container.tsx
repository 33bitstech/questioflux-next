'use client'
import React, { useState } from 'react'

import styles from './filters-container.module.scss'
import { TFilter } from '@/types/filtersType'
import CategoriesList from './categories-list'
import { useFilters } from '@/contexts/filtersContext'

interface IProps{
    setFilterClicked: () => void
}

export default function FiltersContainer({setFilterClicked}: IProps) {
    const {selectFilters, filtersSelected} = useFilters(),
        [filters, setFilters] = useState<TFilter[]>(filtersSelected)

    const handleApply = ()=>{
        if (filters) {
            selectFilters(filters)
            setFilterClicked()
        }
    }

    return (
        <div className={`${styles.filters_popup}`}>
            <div className={styles.filters_container}>
                <div className={styles.quiz_types}>
                    <p>Type of Quiz</p>
                    <ul>
                        <li className={styles.active_li}>All</li>
                        <li className={`${styles.types_soon}`}>Personality</li>
                        <li className={`${styles.types_soon}`}>Image</li>
                        <li className={`${styles.types_soon}`}>Right and Wrong</li>
                    </ul>
                </div>
                <div className={styles.categories}>
                    <p>Category</p>
                    <CategoriesList styles={styles} filters={filters} setFilters={setFilters}/>
                </div>
            </div>
            <button className={styles.apply_filters} onClick={handleApply}>Apply</button>
        </div>
    )
}
