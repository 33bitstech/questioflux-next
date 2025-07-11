'use client'
import { TStyles } from '@/types/stylesType'
import React, { useEffect, useState } from 'react'
import QuizCard from '../Card/quiz-card'
import { useSearchParams } from 'next/navigation'
import useGettingQuiz from '@/hooks/requests/quiz-requests/useGettingQuiz'
import IQuizes from '@/interfaces/IQuizes'
import { useFilters } from '@/contexts/filtersContext'
import { useTranslations } from 'next-intl' 
import LoadingQuizzes from '../Loading/loading-quizzes'
import { getFeaturedsQuizzes } from '@/app/[locale]/(quizGroup)/explore/page'

interface IProps{
    styles: TStyles
}

export default function FeaturedsContainer({styles}: IProps) {
    const t = useTranslations('explorePage'); 

    const sp = useSearchParams(),
        isSearching = sp.size > 0,
        [popular, setPopular] = useState<IQuizes[]>(),
        {filtersSelected} = useFilters(),
        [loading, setLoading] = useState(true)

    useEffect(()=>{
        const get = async() =>{
            try {
                const quizzes = await getFeaturedsQuizzes()
                setPopular(quizzes)
                setLoading(false)
            } catch (err) {
                console.log(err)
                setLoading(false)
            }
        }
        get()
    },[])

    if(isSearching || filtersSelected.length > 0) return null
    return (
        <div className={styles.results}>
            <h3>{t('featuredTitle')}</h3>
            <LoadingQuizzes 
                loading={loading}
            />
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