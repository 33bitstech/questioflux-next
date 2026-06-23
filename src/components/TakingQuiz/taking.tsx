'use client'
import IQuizes from '@/interfaces/IQuizes'
import { TStyles } from '@/types/stylesType'
import React, { useEffect, useState } from 'react'
import TimerContainer from '../widgets/TakingQuiz/timer-container'
import QuestionsContainer from './questions-container'
import { startQuiz, takeQuiz } from '@/app/[locale]/(quizGroup)/(quizTaking)/quiz/[quizId]/taking/actions'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { useRouter } from '@/i18n/navigation'
import { setCookie } from 'cookies-next'
import LoadingReq from '../Loading/loading-req'
import { useTranslations } from 'next-intl'

interface IProps {
    styles: TStyles,
    quiz: IQuizes
}

const getDummyQuestions = (typeOfQuiz?: string) => {
    const isImageQuiz = typeOfQuiz === 'image/RW'

    return [
        {
            questionId: 'hidden',
            question: '████████████████████████████████████',
            title: '██████████',
            answers: isImageQuiz
                ? [
                    { answer: 'dummy-1', thumbnail: '', text: '████████' },
                    { answer: 'dummy-2', thumbnail: '', text: '████████' },
                    { answer: 'dummy-3', thumbnail: '', text: '████████' },
                    { answer: 'dummy-4', thumbnail: '', text: '████████' }
                ]
                : ['████████', '████████', '████████', '████████'],
            correctAnswer: isImageQuiz
                ? { answer: 'dummy-1', thumbnail: '', text: '████████' }
                : '████████',
            image: ''
        }
    ]
}

export default function TakingComponent({ quiz, styles }: IProps) {
    const [started, setStarted] = useState<boolean>(false),
        [initialTime, setInitialTime] = useState<number>(0),
        [result, setResult] = useState<{ quizAnswer: any; guest?: string }>(),
        { setError } = useGlobalMessage(),
        [loadingReq, setLoadingReq] = useState<boolean>(false),
        route = useRouter(),
        [finalTime, setFinalTime] = useState(0)

    const t = useTranslations('takingPage')
    const handleStart = async () => {
        const { ok } = await startQuiz(quiz.quizId)
        if (!ok) return setError('Could not start the quiz. Please try again.')
        setInitialTime(Date.now())
        setStarted(true)
    }

    const handleScroll = () => window.scrollTo({ top: 350, behavior: 'smooth' })

    useEffect(() => {
        if (result && quiz) {
            takeQuiz(quiz.quizId, result)
                .then(({ err, res }) => {
                    if (err) return setError(err)
                    if (res) {
                        const safeCookieValue = encodeURIComponent(JSON.stringify(res));
                        setCookie('quizResults', safeCookieValue);
                        route.push(`/quiz/${quiz.quizId}/results`)
                    }
                })
                .catch(console.log)
                .finally(() => setLoadingReq(false))
        }
    }, [result, quiz])

    const questionsToRender = started ? quiz.questions : getDummyQuestions(quiz.type) as any
    return (
        <>
            {loadingReq && <LoadingReq loading={loadingReq} />}
            <div className={styles.header_quiz}>
                <h1>{quiz?.title}</h1>
                <TimerContainer
                    quiz={quiz} styles={styles}
                    setStarted={handleStart} finalTime={finalTime}
                    started={started} initialTime={initialTime}
                />
            </div>
            <div className={styles.containerStart}>
                <div className={started ? styles.start : styles.block}></div>{!started && (
                    <div className={styles.blurOverlay}>
                        <div className={styles.blurMessage}>
                            <p>{t('blurMessage')}</p>
                        </div>
                    </div>
                )}
                <div className={!started ? styles.blurredContent : ''} aria-hidden={!started}>
                    {quiz.questions && quiz.type && <QuestionsContainer
                        qtdQuestions={started ? quiz?.qtdQuestions : 1}
                        questions={questionsToRender}
                        quizId={quiz.quizId}
                        initialTime={initialTime}
                        typeOfQuiz={quiz?.type}
                        handleScroll={handleScroll}
                        started={started}
                        setStarted={setStarted}
                        setResult={setResult}
                        startLoading={() => setLoadingReq(true)}
                        finalTime={finalTime}
                        setFinalTime={setFinalTime}
                    />}
                </div>
            </div>
        </>
    )
}