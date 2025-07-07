'use client'
import useGettingQuiz from '@/hooks/requests/quiz-requests/useGettingQuiz'
import IQuizes from '@/interfaces/IQuizes'
import { TStyles } from '@/types/stylesType'
import React, { useEffect, useState } from 'react'
import QuizCard from '../Card/quiz-card'
import ArrowSvg from '../Icons/ArrowSvg'
import { useFilters } from '@/contexts/filtersContext'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl' 
import LoadingQuizzes from '../Loading/loading-quizzes'

interface IProps {
    styles : TStyles
}

export default function SearchResults({styles} : IProps) {
    const t = useTranslations('explorePage.buttons'); 
    
    const {publicQuizzes} = useGettingQuiz(),
        {filtersSelected} = useFilters(),
        {searchQuiz} = useGettingQuiz(),
        [quizzes, setQuizzes] = useState<IQuizes[]>(),
        [results, setResults] = useState<IQuizes[]>(),
        [visibleQuizzesQtd, setVisibleQuizzesQtd] = useState(9),
        [viewAllExplore, setViewAllExplore] = useState(false),
        searchParams = useSearchParams(),
        title = searchParams.get('title') || '',
        tags = searchParams.get('tags') || '',
        categories = searchParams.get('categories') || '',

        [loading, setLoading] = useState(true)

    const handleViewMore = ()=>{ setVisibleQuizzesQtd(()=>visibleQuizzesQtd+9) },
        handleViewLess = ()=>{ setVisibleQuizzesQtd(9); setViewAllExplore(false) },
        handleFilteringQuizzes = () =>{ setResults(results?.filter(quiz=>filtersSelected.includes(quiz.category))) }

     useEffect(()=>{
        const get = async ()=>{
            try {
                const res = await publicQuizzes()
                setQuizzes(res.quizzes)
                setResults(res.quizzes)
                setLoading(false)
            } catch (err) {
                console.log(err)
                setLoading(false)
            }
        }
        get()
    },[])
    useEffect(()=>{
        if(filtersSelected.length > 0) {
            handleFilteringQuizzes()
        }else{
            setResults(quizzes)
        }
    },[filtersSelected])
    useEffect(()=>{
        if(title || tags || categories){
            const get = async () =>{
                try {
                    const res = await searchQuiz(title, categories, tags)
                    setResults(res.quizzes)
                    setLoading(false)
                } catch (err) {
                    console.log(err)
                    setLoading(false)
                }
            }
            get()
        }else{
            setResults(quizzes)
        }
        
    }, [title, tags, categories])

    return (
        <>
            <LoadingQuizzes 
                loading={loading}
            />
            <div className={styles.quizes_container}>
                {results?.slice(0,9).map((quiz, index)=>(
                    <QuizCard key={index} quiz={quiz} />
                ))}
            </div>
            
            {Array.isArray(results) && results?.length > visibleQuizzesQtd && (
                <button onClick={()=>setViewAllExplore(!viewAllExplore)} className={`${styles.seemore_button} ${viewAllExplore ? styles.active : ''}`}>
                    <p>
                        {/* Usar traduções */}
                        {viewAllExplore ? t('seeLess'): t('seeMore')}
                    </p>
                    <ArrowSvg/>
                </button>
            )}
            {viewAllExplore && <div className={styles.more_content}>
                <div className={styles.quizes_container}>
                    {results?.slice(9, visibleQuizzesQtd+9).map((quiz, index)=>(
                        <QuizCard key={index} quiz={quiz} />
                    ))}
                </div>    
                {Array.isArray(results) && results?.length > visibleQuizzesQtd + 9 ? <>
                    <button onClick={()=>{ setViewAllExplore(true); handleViewMore() }} className={`${styles.seemore_button}`}>
                        <p>{t('seeMore')}</p>
                        <ArrowSvg/>
                    </button>
                </> : <>
                    <button onClick={()=>{ setViewAllExplore(true); handleViewLess() }} className={`${styles.seemore_button} ${styles.active}`}>
                        <p>{t('seeLess')}</p>
                        <ArrowSvg/>
                    </button>
                </>}
            </div>}
        </>
    )
}