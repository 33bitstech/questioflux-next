'use client'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { useUser } from '@/contexts/userContext'
import IQuestion from '@/interfaces/IQuestion'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './questions-container.module.scss'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import usePopupAuth from '@/hooks/usePopupAuth'
import RegisterComponent from '../AuthForms/register-component'
import LoginComponent from '../AuthForms/login-component'
import GuestForm from '../AuthForms/Guest/guest-form'
import { Expand, Shrink } from 'lucide-react'
import { useTheme } from 'next-themes'
import { IGoogleReturn } from '../AuthForms/Auth-client-components/google-auth-button'

// Respostas de antes do login com Google, de volta à página: o popup abre de novo com elas
export interface IResumeAnswers {
    answers: unknown[]
    popup: 'guest' | 'login'
}

interface IProps {
    qtdQuestions: number
    questions: IQuestion[]
    initialTime: number
    typeOfQuiz: 'default/RW' | 'image/RW'
    handleScroll: () => void
    started: boolean,
    pauseQuiz: () => Promise<void>
    // no embed quem não está logado só entra como visitante
    guestOnly?: boolean
    // formatos sem ranking (personalidade): o visitante pode seguir sem apelido
    allowAnonymous?: boolean
    setStarted: React.Dispatch<React.SetStateAction<boolean>>
    setResult: React.Dispatch<React.SetStateAction<{
        quizAnswer: any;
        guest?: string
    } | undefined>>
    finalTime: number,
    setFinalTime: React.Dispatch<React.SetStateAction<number>>
    onQuestionAnswered?: (questionNumber: number, answered: number) => void
    resume?: IResumeAnswers
    // login com Google no popup: a página guarda as respostas (save) e o Google volta para path
    googleResume?: { path: string, save: (answers: unknown[]) => void }
}

interface ISelectedAnswers {
    [questionId: string | number]: string | number
}

type ImageAnswer = {
    answer: string
    thumbnail: string
    text: string
}

const isValidImageAnswer = (answer: unknown): answer is ImageAnswer => {
    return (
        typeof answer === 'object' &&
        answer !== null &&
        !Array.isArray(answer) &&
        'answer' in answer &&
        'thumbnail' in answer &&
        typeof (answer as any).answer === 'string' &&
        typeof (answer as any).thumbnail === 'string'
    )
}

export default function QuestionsContainer({
    handleScroll, initialTime, qtdQuestions,
    questions, setStarted,
    started, typeOfQuiz, setResult,
    finalTime, setFinalTime,
    pauseQuiz, guestOnly, allowAnonymous,
    onQuestionAnswered, resume, googleResume
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

    const theme = useTheme()
    const [isQuestionImageContained, setIsQuestionImageContained] =
        useState(false)

    const toggleQuestionImageFit = () => {
        setIsQuestionImageContained((currentValue) => !currentValue)
    }
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
        // trocar de alternativa na mesma pergunta não conta como nova resposta
        if (!((actualQuestion - 1) in selectedAnswers)) {
            onQuestionAnswered?.(actualQuestion, Object.keys(selectedAnswers).length + 1)
        }
        setSelectedAnswers({ ...selectedAnswers, [actualQuestion - 1]: index })
    }

    const handleRegisterAndFinishQuiz = (name?: string) => {
        setCanShowRegister(false)
        // de volta do login com Google: as respostas guardadas vão direto
        if (resume) return setResult({ quizAnswer: resume.answers, guest: name })
        if (selectedValuesCopy) setSelectedValues(selectedValuesCopy)
        if (name) setGuestName(name)
    }

    const handleSelectValues = () => {
        if (typeOfQuiz === 'default/RW') {
            setSelectedValues(Object.entries(selectedAnswers).map((ans) => {
                const [questionIndex, answerIndex] = ans
                const currentQuestion = answerArray[Number(questionIndex)]

                return {
                    answer: currentQuestion?.answers?.[Number(answerIndex)] ?? '',
                    questionId: questions[Number(questionIndex)]?.questionId
                }
            }))
        } else if (typeOfQuiz === 'image/RW') {
            setSelectedValues(Object.entries(selectedAnswers).map((ans) => {
                const [questionIndex, answerIndex] = ans
                return { answer: answerIndex, questionId: questions[Number(questionIndex)]?.questionId }
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

        await pauseQuiz()
        setFinalTime(Date.now())

        handleSelectValuesCopy()

        if (!user) setCanShowRegister(true)

        handleSelectValues()
    }
    const handleGoToQuestion = (questionNumber: number) => {
        if (!started) return
        if (questionNumber === actualQuestion) return

        handleScroll()
        setActualQuestion(questionNumber)
    }

    const hasAnsweredAllQuestions = () => Object.keys(selectedAnswers).length === qtdQuestions
    const shouldShowResultsButton = () => actualQuestion === qtdQuestions || Object.keys(selectedAnswers).length === qtdQuestions
    const verifyAllAnswered = () => Object.keys(selectedValues).length === Object.keys(answerArray).length

    useEffect(() => { toGuest() }, [])

    useEffect(() => {
        if (!resume) return
        if (resume.popup === 'login') toLogin()
        else toGuest()
        setCanShowRegister(true)
    }, [resume])

    // no embed não há login com Google (o iframe não aceita os redirecionamentos)
    const googleReturn: IGoogleReturn | undefined = googleResume && !guestOnly ? {
        path: googleResume.path,
        onLeave: () => googleResume.save(resume?.answers ?? selectedValuesCopy ?? []),
    } : undefined

    useEffect(() => {
        if (questions) {
            let answersArray: IQuestion[] = []
            if (typeOfQuiz === 'default/RW') {
                answersArray = questions.map((question, indexQ) => ({
                    ...question,
                    answers: ShuffleArray([...questions[indexQ]?.answers, ...(questions[indexQ]?.correctAnswer ? [questions[indexQ]?.correctAnswer] : [])])
                }))
            } else if (typeOfQuiz === 'image/RW') {
                answersArray = questions.map((question) => {
                    const imageAnswers = Array.isArray(question.answers)
                        ? question.answers
                        : []

                    return {
                        ...question,
                        answers: ShuffleArray(imageAnswers.filter(isValidImageAnswer))
                    }
                })
            }
            setAnswerArray(answersArray ?? [])
        }
    }, [questions])

    useEffect(() => {
        // com o popup aberto, espera o login ou o nome de visitante
        if (!user && canShowRegister) return
        if (selectedValues && verifyAllAnswered()) {
            setResult({ quizAnswer: selectedValues, guest: guestName })
        }
    }, [selectedValues, guestName])

    useLayoutEffect(() => {
        const previousScrollRestoration = window.history.scrollRestoration

        window.history.scrollRestoration = 'manual'

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'auto'
        })

        const animationFrame = requestAnimationFrame(() => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'auto'
            })
        })

        return () => {
            cancelAnimationFrame(animationFrame)
            window.history.scrollRestoration = previousScrollRestoration
        }
    }, [])

    return (
        <div className={`${styles.Answering}`}>
            <div className={styles.questions_amount}>
                {Array.from({ length: qtdQuestions }, (_, index) => {
                    const questionNumber = index + 1

                    return (
                        <div
                            key={index}
                            role="button"
                            tabIndex={started ? 0 : -1}
                            className={`${styles.circle_background} 
                            ${verifyActualQuestion(index) ? styles.question_actived : ''}`}
                            onClick={() => handleGoToQuestion(questionNumber)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleGoToQuestion(questionNumber)
                                }
                            }}
                        >
                            <div className={styles.circle_container}>
                                <span>{questionNumber}</span>
                            </div>
                        </div>
                    )
                })}
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
                        <button
                            className={actualQuestion === 1 ? `${styles.hidden_button}` : ''}
                            onClick={handlePreviusQuestion}
                        >
                            {t('navigation.previous')}
                        </button>

                        {shouldShowResultsButton() ? (
                            <button onClick={handleResult} style={{ zIndex: 7 }}>
                                {t('navigation.results')}
                            </button>
                        ) : (
                            <button onClick={handleNextQuestion}>
                                {t('navigation.next')}
                            </button>
                        )}
                    </div>
                </div>
            </div>}

            {/* no body: antes de "Iniciar" as questões ficam num bloco com filter: blur, que
                prende o popup (position: fixed) dentro dele, borrado e sem cliques. Isso acontece
                quando a pessoa volta do login com Google e o popup abre de novo. */}
            {!user && canShowRegister && createPortal(<div>
                {typePopup === 'register'
                    && <RegisterComponent
                        locale={locale}
                        absolute={true}
                        toLogin={toLogin}
                        toGuest={toGuest}
                        handleRegisterAndFinishQuiz={handleRegisterAndFinishQuiz}
                        show_pop_up={setCanShowRegister}
                        googleReturn={googleReturn}
                    />
                }
                {typePopup === 'login' &&
                    <LoginComponent
                        locale={locale}
                        toRegister={toRegister}
                        handleRegisterAndFinishQuiz={handleRegisterAndFinishQuiz}
                        show_pop_up={setCanShowRegister}
                        googleReturn={googleReturn}
                    />
                }
                {typePopup === 'guest' &&
                    <GuestForm
                        allowAnonymous={allowAnonymous}
                        toRegister={guestOnly ? undefined : toRegister}
                        handleRegisterAndFinishQuiz={handleRegisterAndFinishQuiz}
                        show_pop_up={setCanShowRegister}
                        googleReturn={googleReturn}
                    />
                }
            </div>, document.body)}

            {typeOfQuiz === 'image/RW' && <div className={styles.question_answering_image}>
                <div className={styles.taking_image_container}>
                    <div className={styles.image}>
                        <Image
                            className={`${styles.question_image} ${isQuestionImageContained
                                ? styles.question_image_contained
                                : ''
                                }`}
                            src={
                                questions[actualQuestion - 1].image ||
                                (theme.theme === 'light' ? '/quiz_padrao_branco.png' : '/quiz_padrao_preto.png')
                            }
                            alt={t('imageAlts.question')}
                            width={900}
                            height={900}
                            quality={85}
                            placeholder="blur"
                            blurDataURL={blurLoading}
                            fetchPriority="high"
                            loading="eager"
                        />

                        <button
                            type="button"
                            className={styles.image_fit_button}
                            onClick={toggleQuestionImageFit}
                            disabled={!started}
                            aria-pressed={isQuestionImageContained}
                            aria-label={
                                isQuestionImageContained
                                    ? 'Voltar ao preenchimento da imagem'
                                    : 'Exibir a imagem completa'
                            }
                            title={
                                isQuestionImageContained
                                    ? 'Reduzir imagem'
                                    : 'Expandir imagem'
                            }
                        >
                            {isQuestionImageContained ? (
                                <Shrink aria-hidden="true" />
                            ) : (
                                <Expand aria-hidden="true" />
                            )}
                        </button>
                    </div>
                    <div className={styles.footer_question}>
                        <p>{questions[actualQuestion - 1].title}</p>
                    </div>
                </div>
                <div className={styles.answers_container}>
                    {answerArray.length > 0 && answerArray[actualQuestion - 1]?.answers
                        ?.filter(isValidImageAnswer)
                        .map((answer, i) => {
                            const answerId = answer.answer

                            return (
                                <div
                                    className={`${styles.taking_image_container} 
                                        ${verifySelectedAnswer(answerId) ? styles.answer_input_selected : ''}`}
                                    key={answerId}
                                    onClick={() => handleSelectAnswer(answerId)}
                                >
                                    <div className={styles.image}>
                                        <Image
                                            width={600}
                                            height={600}
                                            src={
                                                answer.thumbnail ||
                                                (theme.theme === 'light' ? '/quiz_padrao_branco.png' : '/quiz_padrao_preto.png')
                                            }
                                            alt={t('imageAlts.alternative')}
                                            placeholder='blur'
                                            blurDataURL={blurLoading}
                                            loading='eager'
                                        />
                                    </div>

                                    <div className={styles.footer_question}>
                                        {!!answer.text
                                            ? <p>{answer.text}</p>
                                            : <p>{t('imageLabels.alternative', { number: i + 1 })}</p>
                                        }
                                    </div>
                                </div>
                            )
                        })}
                </div>
                <div className={styles.answers_actions}>
                    <button
                        className={actualQuestion === 1 ? `${styles.hidden_button}` : ''}
                        onClick={handlePreviusQuestion}
                    >
                        {t('navigation.previous')}
                    </button>

                    {shouldShowResultsButton() ? (
                        <button onClick={handleResult} style={{ zIndex: 7 }}>
                            {t('navigation.results')}
                        </button>
                    ) : (
                        <button onClick={handleNextQuestion}>
                            {t('navigation.next')}
                        </button>
                    )}
                </div>
            </div>}
        </div>
    )
}