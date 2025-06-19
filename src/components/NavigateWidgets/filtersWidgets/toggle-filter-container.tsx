'use client'
import ArrowSvg from '@/components/Icons/ArrowSvg'
import { TStyles } from '@/types/stylesType'
import React, { useState } from 'react'
import FiltersContainer from './filters-container'

interface IProps {
    styles: TStyles
}

export default function ToggleFilterContainer({styles}: IProps) {
    const [filterClicked, setFilterClicked] = useState<boolean>(false)

    const handleFilterClick = ()=>{
        setFilterClicked(!filterClicked)
    }

    return (
        <>
            <div className={`${styles.filter_button} ${filterClicked ? styles.active : ''}`} onClick={handleFilterClick}>
                <p>Filters</p>
                <ArrowSvg/>
            </div>
            <div className={styles.filter_popup_container}>
                {filterClicked && <FiltersContainer setFilterClicked={handleFilterClick}/>}
            </div>
        </>
    )
}
