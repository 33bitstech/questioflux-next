'use client'
import { useFilters } from '@/contexts/filtersContext'
import { TFilter } from '@/types/filtersType'
import { TStyles } from '@/types/stylesType'
import { useLocale } from 'next-intl'
import React, { useEffect, useState } from 'react'

interface IProps {
    styles: TStyles,
    filters: TFilter[],
    setFilters: React.Dispatch<React.SetStateAction<TFilter[]>>
}

export default function CategoriesList({styles, filters, setFilters}:IProps) {
    const {filters: categories, filtersPt} = useFilters()

    const locale = useLocale()

    const verifyFilterSelect = (category:TFilter) =>{
        return filters.find(filter=>filter == category)
    },
    handleFilterSelected = (category:TFilter) =>{
        if (verifyFilterSelect(category)){
            setFilters(prevState => prevState.filter(filter => filter !== category))
        }else{
            setFilters(state=>[
                ...state,
                category
            ])
        }
    }

    return (
        <ul>
            {locale == 'pt' 
                ? <>
                    {filtersPt.map((categorie, index)=>(
                        <li key={index} className={verifyFilterSelect(categories[index]) ? styles.active_li : ''} onClick={()=>handleFilterSelected(categories[index])}>{categorie}</li>
                    ))}
                </> 
                : <>
                    {categories.map((categorie, index)=>(
                        <li key={index} className={verifyFilterSelect(categorie) ? styles.active_li : ''} onClick={()=>handleFilterSelected(categorie)}>{categorie}</li>
                    ))}
                </>}
        </ul>
    )
}
