'use client'
import ArrowSvg from '@/components/Icons/ArrowSvg'
import { TStyles } from '@/types/stylesType'
import React, { useState } from 'react'
import FiltersContainer from './filters-container'
import { useTranslations } from 'next-intl'

interface IProps {
    styles: TStyles
}

export default function ToggleFilterContainer({styles}: IProps) {
    const [filterClicked, setFilterClicked] = useState<boolean>(false),
        t = useTranslations('contextualHeader')

    const handleFilterClick = ()=>{
        setFilterClicked(!filterClicked)
    }

    return (
        <>
            <div className={`${styles.filter_button} ${filterClicked ? styles.active : ''}`} onClick={handleFilterClick}>
                <p>{t('filters')}</p>
                <ArrowSvg/>
            </div>
            <div className={styles.filter_popup_container}>
                {filterClicked && <FiltersContainer setFilterClicked={handleFilterClick}/>}
            </div>
        </>
    )
}
