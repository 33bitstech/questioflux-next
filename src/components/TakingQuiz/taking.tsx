'use client'
import IQuizes from '@/interfaces/IQuizes'
import { TStyles } from '@/types/stylesType'
import React, { useEffect, useState } from 'react'
import TimerContainer from '../widgets/TakingQuiz/timer-container'
import QuestionsContainer from './questions-container'
import { takeQuiz } from '@/app/[locale]/(quizGroup)/(quizTaking)/quiz/[quizId]/taking/actions'
import { useUser } from '@/contexts/userContext'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { useRouter } from '@/i18n/navigation'
import { setCookie } from 'cookies-next/client'
import LoadingReq from '../Loading/loading-req'

interface IProps{
    styles: TStyles,
    quiz: IQuizes
}

export default function TakingComponent({quiz, styles}:IProps) {
    const [started, setStarted] = useState<boolean>(false),
        [initialTime, setInitialTime] = useState<number>(0),
        [result, setResult] = useState<{
            quizAnswer: any,
            timing: number,
            guest?: string
        }>(),
        {token} = useUser(),
        {setError} = useGlobalMessage(),
        [loadingReq, setLoadingReq] = useState<boolean>(false),
        route = useRouter()


    const handleStart = () =>{
        setInitialTime(Date.now())
        setStarted(true)
    },
    handleScroll = ()=>{
        window.scrollTo({top: 350, behavior:'smooth'})
    }

    useEffect(()=>{
        if(result && quiz){
            takeQuiz(quiz.quizId, result, token ? String(token) : undefined)
                .then(({err, res})=>{
                    if(err) return setError(err)
                    if(res){
                        setCookie('quizResults', JSON.stringify(res))
                        if(result.guest) return route.push(`/quiz/${quiz.quizId}/leaderboard`)
                        route.push(`/quiz/${quiz.quizId}/results`)
                    }
                })
                .catch(console.log)
                .finally(()=>{
                    setLoadingReq(false)
                })
        }
    },[result, quiz])

    return (
        <>
            {loadingReq && <LoadingReq loading={loadingReq}/>}
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
                    startLoading={()=>{setLoadingReq(true)}}
                />}
            </div>
        </>
    )
}
