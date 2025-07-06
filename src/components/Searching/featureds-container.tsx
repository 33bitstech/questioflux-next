'use client'
import { TStyles } from '@/types/stylesType'
import React, { useEffect, useState } from 'react'
import QuizCard from '../Card/quiz-card'
import { useSearchParams } from 'next/navigation'
import useGettingQuiz from '@/hooks/requests/quiz-requests/useGettingQuiz'
import IQuizes from '@/interfaces/IQuizes'
import { useFilters } from '@/contexts/filtersContext'
import { useTranslations } from 'next-intl' // Importar

interface IProps{
    styles: TStyles
}

export default function FeaturedsContainer({styles}: IProps) {
    const t = useTranslations('explorePage'); // Inicializar hook

    const sp = useSearchParams(),
        isSearching = sp.size > 0,
        {featuredQuizzes} = useGettingQuiz(),
        [popular, setPopular] = useState<IQuizes[]>(),
        {filtersSelected} = useFilters()

    useEffect(()=>{
        const get = async() =>{
            try {
                const res = await featuredQuizzes()
                setPopular(res.quizzesSort)
            } catch (err) {
                console.log(err)
            }
        }
        get()
    },[])

    if(isSearching || filtersSelected.length > 0) return null
    return (
        <div className={styles.results}>
            {/* Usar a tradução */}
            <h3>{t('featuredTitle')}</h3>
            <div className={styles.quizes_container}>
                {popular?.slice(0,3).map((quiz, index)=>(
                    <QuizCard 
                        key={index} 
                        quiz={quiz}
                    />
                ))}
            </div>
        </div>
    )
}