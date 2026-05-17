'use client'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { useUser } from '@/contexts/userContext'
import IQuestion from '@/interfaces/IQuestion'
import React, { useEffect, useState } from 'react'
import styles from './questions-container.module.scss'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import usePopupAuth from '@/hooks/usePopupAuth'
import RegisterComponent from '../AuthForms/register-component'
import LoginComponent from '../AuthForms/login-component'
import GuestForm from '../AuthForms/Guest/guest-form'
import { pauseQuiz } from '@/app/[locale]/(quizGroup)/(quizTaking)/quiz/[quizId]/taking/actions'

interface IProps {
    qtdQuestions: number
    questions: IQuestion[]
    quizId: string
    initialTime: number
    typeOfQuiz: 'default/RW' | 'image/RW'
    handleScroll: () => void
    started: boolean,
    startLoading: () => void
    setStarted: React.Dispatch<React.SetStateAction<boolean>>
    setResult: React.Dispatch<React.SetStateAction<{
        quizAnswer: any;
        guest?: string
    } | undefined>>
    finalTime: number,
    setFinalTime: React.Dispatch<React.SetStateAction<number>>
}

interface ISelectedAnswers {
    [questionId: string | number]: string | number
}

export default function QuestionsContainer({
    handleScroll, initialTime, qtdQuestions,
    questions, quizId, setStarted,
    started, typeOfQuiz, setResult,
    startLoading, finalTime, setFinalTime
}: IProps) {
    const [actualQuestion, setActualQuestion] = useState<number>(1),
        [answerArray, setAnswerArray] = useState<IQuestion[]>([]),
        [selectedAnswers, setSelectedAnswers] = useState<ISelectedAnswers>({}),
        [selectedValues, setSelectedValues] = useState<any>(),
        [selectedValuesCopy, setSelectedValuesCopy] = useState<any>(),
        [canShowRegister, setCanShowRegister] = useState(false),
        { setError } = useGlobalMessage(),
        { user } = useUser(),
        { toGuest, typePopup, toLogin, toRegister } = usePopupAuth(),
        [guestName, setGuestName] = useState('')

    const t = useTranslations('takingPage'),
        locale = useLocale(),
        blurLoading = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88eJ1PQAI/gMrw32C7wAAAABJRU5ErkJggg=='

    const verifyActualQuestion = (indexQuestion: number) =>
        indexQuestion + 1 == actualQuestion

    const verifySelectedAnswer = (indexAnswer: number | string) =>
        selectedAnswers[actualQuestion - 1] == indexAnswer

    const ShuffleArray = (arr: Array<any>) =>
        arr.sort(() => Math.random() - 0.5)

    const handleNextQuestion = () => {
        if (!started) return
        if (actualQuestion === qtdQuestions) return
        handleScroll()
        setActualQuestion(actualQuestion + 1)
    }

    const handlePreviusQuestion = () => {
        if (!started) return
        if (actualQuestion === 1) return
        handleScroll()
        setActualQuestion(actualQuestion - 1)
    }

    const handleSelectAnswer = (index: number | string) => {
        if (!started) return
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
        setSelectedAnswers({ ...selectedAnswers, [actualQuestion - 1]: index })
    }

    const handleRegisterAndFinishQuiz = (name?: string) => {
        setCanShowRegister(false)
        if (selectedValuesCopy) setSelectedValues(selectedValuesCopy)
        if (name) setGuestName(name)
    }

    const handleSelectValues = () => {
        if (typeOfQuiz === 'default/RW') {
            setSelectedValues(Object.entries(selectedAnswers).map((ans) => {
                const [questionIndex, answerIndex] = ans
                return { answer: answerArray[Number(questionIndex)].answers[Number(answerIndex)], questionId: questions[Number(questionIndex)].questionId }
            }))
        } else if (typeOfQuiz === 'image/RW') {
            setSelectedValues(Object.entries(selectedAnswers).map((ans) => {
                const [questionIndex, answerIndex] = ans
                return { answer: answerIndex, questionId: questions[Number(questionIndex)].questionId }
            }))
        }
    }

    const handleSelectValuesCopy = () => {
        if (typeOfQuiz === 'default/RW') {
            setSelectedValuesCopy(Object.entries(selectedAnswers).map((ans) => {
                const [questionIndex, answerIndex] = ans
                return { answer: answerArray[Number(questionIndex)].answers[Number(answerIndex)], questionId: questions[Number(questionIndex)].questionId }
            }))
        } else if (typeOfQuiz === 'image/RW') {
            setSelectedValuesCopy(Object.entries(selectedAnswers).map((ans) => {
                const [questionIndex, answerIndex] = ans
                return { answer: answerIndex, questionId: questions[Number(questionIndex)].questionId }
            }))
        }
    }

    const handleResult = async () => {
        if (Object.keys(selectedAnswers).length < qtdQuestions)
            return setError(t('errors.resAll'))

        await pauseQuiz(quizId)

        setStarted(false)
        setFinalTime(Date.now()) 

        handleSelectValuesCopy()

        if (!user) return setCanShowRegister(true)

        handleSelectValues()
        startLoading()
    }

    const verifyAllAnswered = () =>
        Object.keys(selectedValues).length === Object.keys(answerArray).length

    useEffect(() => { toGuest() }, [])

    useEffect(() => {
        if (questions) {
            let answersArray: IQuestion[] = []
            if (typeOfQuiz === 'default/RW') {
                answersArray = questions.map((question, indexQ) => ({
                    ...question,
                    answers: ShuffleArray([...questions[indexQ]?.answers, ...(questions[indexQ]?.correctAnswer ? [questions[indexQ]?.correctAnswer] : [])])
                }))
            } else if (typeOfQuiz === 'image/RW') {
                answersArray = questions.map((question) => ({
                    ...question,
                    answers: ShuffleArray([...question.answers])
                }))
            }
            setAnswerArray(answersArray ?? [])
        }
    }, [questions])

    useEffect(() => {
        if (!user && canShowRegister) {
            const savedResults = localStorage.getItem('quizAnswers')
            if (savedResults) {
                // timing omitted — the server calculates it from the httpOnly cookie
                setResult({ quizAnswer: JSON.parse(savedResults), guest: guestName })
            }
        } else if (selectedValues && verifyAllAnswered()) {
            // timing omitted — the server calculates it from the httpOnly cookie
            setResult({ quizAnswer: selectedValues, guest: guestName })
        }
    }, [selectedValues, guestName])

    return (
        <div className={`${styles.Answering}`}>
            <div className={styles.questions_amount}>
                {Array.from({ length: qtdQuestions }, (_, index) => (
                    <div key={index} className={`${styles.circle_background} 
                    ${verifyActualQuestion(index) ? styles.question_actived : ''}`}>
                        <div className={styles.circle_container}>
                            <span>{index + 1}</span>
                        </div>
                    </div>
                ))}
            </div>

            {typeOfQuiz === 'default/RW' && <div className={styles.question_answering}>
                <h3>{questions && questions[actualQuestion - 1]?.question}</h3>
                <div className={styles.answers}>
                    {answerArray.length > 0 && answerArray[actualQuestion - 1].answers.map((answer, index) => (
                        <div className={`${styles.answer_container} ${verifySelectedAnswer(index) ? styles.answer_input_selected : ''}`} key={index} onClick={() => handleSelectAnswer(index)}>
                            <div className={styles.answer_input}>
                                <p>{answer.toString()}</p>
                            </div>
                        </div>
                    ))}
                    <div className={styles.answers_actions}>
                        <button className={actualQuestion === 1 ? `${styles.hidden_button}` : ''} onClick={handlePreviusQuestion}>{t('navigation.previous')}</button>
                        {actualQuestion === qtdQuestions ? (
                            <button style={{ zIndex: 7 }} onClick={handleResult}>
                                {t('navigation.results')}
                            </button>
                        ) : (
                            <button onClick={handleNextQuestion}>{t('navigation.next')}</button>
                        )}
                    </div>
                </div>
            </div>}

            {!user && canShowRegister && (<div>
                {typePopup === 'register'
                    && <RegisterComponent
                        locale={locale}
                        absolute={true}
                        toLogin={toLogin}
                        toGuest={toGuest}
                        handleRegisterAndFinishQuiz={handleRegisterAndFinishQuiz}
                        show_pop_up={setCanShowRegister}
                    />
                }
                {typePopup === 'login' &&
                    <LoginComponent
                        locale={locale}
                        toRegister={toRegister}
                        handleRegisterAndFinishQuiz={handleRegisterAndFinishQuiz}
                        show_pop_up={setCanShowRegister}
                    />
                }
                {typePopup === 'guest' &&
                    <GuestForm
                        toRegister={toRegister}
                        handleRegisterAndFinishQuiz={handleRegisterAndFinishQuiz}
                        show_pop_up={setCanShowRegister}
                    />
                }
            </div>)}

            {typeOfQuiz === 'image/RW' && <div className={styles.question_answering_image}>
                <div className={styles.taking_image_container}>
                    <div className={styles.image}>
                        <Image
                            src={questions[actualQuestion - 1].image || '/quiz_padrao_preto.png'}
                            alt={t('imageAlts.question')}
                            width={900} height={900} quality={100}
                            placeholder='blur' blurDataURL={blurLoading}
                            fetchPriority='high' loading='lazy'
                        />
                    </div>
                    <div className={styles.footer_question}>
                        <p>{questions[actualQuestion - 1].title}</p>
                    </div>
                </div>
                <div className={styles.answers_container}>
                    {answerArray.length > 0 && answerArray[actualQuestion - 1].answers.map((answer, i) => (
                        <div
                            className={`${styles.taking_image_container} 
                                ${verifySelectedAnswer(typeof answer === 'object' && answer !== null && 'answer' in answer ? answer.answer : answer)
                                    ? styles.answer_input_selected : ''}`}
                            key={i}
                            onClick={() => handleSelectAnswer(typeof answer === 'object' && answer !== null && 'answer' in answer ? answer.answer : answer)}
                        >
                            <div className={styles.image}>
                                <Image
                                    width={600} height={600}
                                    src={typeof answer === 'object' && answer !== null && 'thumbnail' in answer ? answer.thumbnail : ''}
                                    alt={t('imageAlts.alternative')}
                                    placeholder='blur' blurDataURL={blurLoading}
                                    fetchPriority='high' loading='lazy'
                                />
                            </div>
                            <div className={styles.footer_question}>
                                <p>{t('imageLabels.alternative', { number: i + 1 })}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.answers_actions}>
                    <button className={actualQuestion === 1 ? `${styles.hidden_button}` : ''} onClick={handlePreviusQuestion}>{t('navigation.previous')}</button>
                    {actualQuestion === qtdQuestions ? (
                        <>
                            {Object.keys(selectedAnswers).length == qtdQuestions &&
                                <button onClick={handleResult} style={{ zIndex: 7 }}>
                                    {t('navigation.results')}
                                </button>
                            }
                        </>
                    ) : (
                        <button onClick={handleNextQuestion}>{t('navigation.next')}</button>
                    )}
                </div>
            </div>}
        </div>
    )
}