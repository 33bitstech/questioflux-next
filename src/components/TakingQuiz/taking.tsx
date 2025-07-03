'use client'
import IQuizes from '@/interfaces/IQuizes'
import { TStyles } from '@/types/stylesType'
import React, { useEffect, useState } from 'react'
import TimerContainer from '../widgets/TakingQuiz/timer-container'
import QuestionsContainer from './questions-container'

interface IProps{
    styles: TStyles,
    quiz: IQuizes
}

export default function TakingComponent({quiz, styles}:IProps) {
    const [started, setStarted] = useState<boolean>(false),
        [initialTime, setInitialTime] = useState<number>(0),
        [result, setResult] = useState<{
            quizAnswer: any,
            timing: number
        }>()


    const handleStart = () =>{
        setInitialTime(Date.now())
        setStarted(true)
    },
    handleScroll = ()=>{
        window.scrollTo({top: 350, behavior:'smooth'})
    }

    useEffect(()=>{
        if(result){
            console.log(result)
        }
    },[result])

    return (
        <>
            <div className={styles.header_quiz}>
                <h1>{quiz?.title}</h1>

                <TimerContainer 
                    quiz={quiz}
                    styles={styles}
                    setStarted={handleStart}
                    started={started}
                    initialTime={initialTime}
                />
            </div>
            <div className={styles.containerStart}>
                <div className={started ? styles.start : styles.block}></div>
                
                {quiz.questions && quiz.type && <QuestionsContainer 
                    qtdQuestions={quiz?.qtdQuestions} 
                    questions={quiz?.questions} 
                    quizId={quiz.quizId} 
                    initialTime={initialTime} 
                    typeOfQuiz={quiz?.type} 
                    handleScroll={handleScroll} 
                    started={started} 
                    setStarted={setStarted}
                    setResult={setResult}
                />}
            </div>
        </>
    )
}
