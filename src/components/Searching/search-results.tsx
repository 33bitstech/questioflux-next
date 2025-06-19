'use client'
import useGettingQuiz from '@/hooks/requests/quiz-requests/useGettingQuiz'
import IQuizes from '@/interfaces/IQuizes'
import { TStyles } from '@/types/stylesType'
import React, { useEffect, useState } from 'react'

interface IProps {
    styles : TStyles
}


export default function SearchResults({styles} : IProps) {
    const {publicQuizzes} = useGettingQuiz(),
        [quizzes, setQuizzes] = useState<IQuizes[]>()

    useEffect(()=>{
        const get = async ()=>{
            try {
                const res = await publicQuizzes()
                setQuizzes(res.quizzes)
            } catch (err) {
                console.log(err)
            }
        }
        get()
    },[])

    return (
        <>
            <p>aqui estára os quizzes</p>
            {/* <div className={styles.quizes_container}>
                {quizzes?.slice(0,9).map((quiz, index)=>(
                    <QuizBox key={index} 
                        classThemeModule={classThemeModule}
                        quiz={quiz}
                        saveFunc={save}
                        unsaveFunc={unsave}
                        verifySave={verifySave}
                        token={cookie}
                    />
                ))}
            </div>
            {Array.isArray(quizzes) && quizzes?.length > visibleQuizzesQtd && (
                <button onClick={()=>setViewAllExplore(!viewAllExplore)} 
                className={`${styles.seemore_button} ${viewAllExplore ? styles.active : ''}`}>
                    <p>
                        See {viewAllExplore ? 'less': 'more'}
                    </p>
                    <ArrowSvg color={colorReverse}/>
                </button>
            )}
            {viewAllExplore && <div className={styles.more_content}>
                <div className={styles.quizes_container}>
                    {quizzes?.slice(9, visibleQuizzesQtd+9).map((quiz, index)=>(
                        <QuizBox key={index} 
                            classThemeModule={classThemeModule}
                            quiz={quiz}
                            saveFunc={save}
                            unsaveFunc={unsave}
                            verifySave={verifySave}
                            token={cookie}
                        />
                    ))}
                </div>    
                {quizzes?.length > visibleQuizzesQtd + 9 ? <>
                    <button onClick={()=>{
                        setViewAllExplore(true)
                        handleViewMore()
                    }} 
                    className={`${styles.seemore_button}`}>
                        <p>
                            See more
                        </p>
                        <ArrowSvg color={colorReverse}/>
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
                        <ArrowSvg color={colorReverse}/>
                    </button>
                </>}
            </div>} */}
        </>
    )
}
