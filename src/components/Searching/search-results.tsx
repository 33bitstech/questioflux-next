'use client'
import useGettingQuiz from '@/hooks/requests/quiz-requests/useGettingQuiz'
import IQuizes from '@/interfaces/IQuizes'
import { TStyles } from '@/types/stylesType'
import React, { useEffect, useState } from 'react'
import QuizCard from '../Card/quiz-card'
import ArrowSvg from '../Icons/ArrowSvg'
import { useFilters } from '@/contexts/filtersContext'
import { useSearchParams } from 'next/navigation'

interface IProps {
    styles : TStyles
}


export default function SearchResults({styles} : IProps) {
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
        categories = searchParams.get('categories') || ''

    const handleViewMore = ()=>{
        setVisibleQuizzesQtd(()=>visibleQuizzesQtd+9)
    },
    handleViewLess = ()=>{
        setVisibleQuizzesQtd(9)
        setViewAllExplore(false)
    },
    handleFilteringQuizzes = () =>{
        setResults(results?.filter(quiz=>filtersSelected.includes(quiz.category)))
    }

    useEffect(()=>{
        const get = async ()=>{
            try {
                const res = await publicQuizzes()
                setQuizzes(res.quizzes)
                setResults(res.quizzes)
            } catch (err) {
                console.log(err)
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
                } catch (err) {
                    console.log(err)
                }
            }
            get()
        }else{
            setResults(quizzes)
        }
        
    }, [title, tags, categories])

    return (
        <>
            <div className={styles.quizes_container}>
                {results?.slice(0,9).map((quiz, index)=>(
                    <QuizCard 
                        key={index} 
                        quiz={quiz}
                    />
                ))}
            </div>
            
            {Array.isArray(results) && results?.length > visibleQuizzesQtd && (
                <button onClick={()=>setViewAllExplore(!viewAllExplore)} 
                className={`${styles.seemore_button} ${viewAllExplore ? styles.active : ''}`}>
                    <p>
                        See {viewAllExplore ? 'less': 'more'}
                    </p>
                    <ArrowSvg/>
                </button>
            )}
            {viewAllExplore && <div className={styles.more_content}>
                <div className={styles.quizes_container}>
                    {results?.slice(9, visibleQuizzesQtd+9).map((quiz, index)=>(
                        <QuizCard 
                            key={index} 
                            quiz={quiz}
                        />
                    ))}
                </div>    
                {Array.isArray(results) && results?.length > visibleQuizzesQtd + 9 ? <>
                    <button onClick={()=>{
                        setViewAllExplore(true)
                        handleViewMore()
                    }} 
                    className={`${styles.seemore_button}`}>
                        <p>
                            See more
                        </p>
                        <ArrowSvg/>
                    </button>
                </> : <>
                    <button onClick={()=>{
                        setViewAllExplore(true)
                        handleViewLess()
                    }} 
                    className={`${styles.seemore_button} ${styles.active}`}>
                        <p>
                            See less
                        </p>
                        <ArrowSvg/>
                    </button>
                </>}
            </div>}
        </>
    )
}
