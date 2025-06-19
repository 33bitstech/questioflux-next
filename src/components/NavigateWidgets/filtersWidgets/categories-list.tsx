'use client'
import { useFilters } from '@/contexts/filtersContext'
import { TFilter } from '@/types/filtersType'
import { TStyles } from '@/types/stylesType'
import React, { useEffect, useState } from 'react'

interface IProps {
    styles: TStyles,
    filters: TFilter[],
    setFilters: React.Dispatch<React.SetStateAction<TFilter[]>>
}

export default function CategoriesList({styles, filters, setFilters}:IProps) {
    const {filters: categories} = useFilters()

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
            {categories.map((categorie, index)=>(
                <li key={index} className={verifyFilterSelect(categorie) ? styles.active_li : ''} onClick={()=>handleFilterSelected(categorie)}>{categorie}</li>
            ))}
        </ul>
    )
}
