'use client'
import IQuizes from '@/interfaces/IQuizes'
import { TStyles } from '@/types/stylesType'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import TimerContainer from '../widgets/TakingQuiz/timer-container'
import QuestionsContainer from './questions-container'
import { pauseQuiz, startQuiz, takeQuiz } from '@/app/[locale]/(quizGroup)/(quizTaking)/quiz/[quizId]/taking/actions'
import IUserLeaderBoardScore from '@/interfaces/IUserLeaderBoardScore'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { useRouter } from '@/i18n/navigation'
import { setCookie } from 'cookies-next'
import LoadingReq from '../Loading/loading-req'
import { useTranslations } from 'next-intl'
import { quizParams, trackEvent } from '@/utils/analytics'

export interface IQuizScore {
    userForLeaderBoard: IUserLeaderBoardScore
    message: string
}

interface IProps {
    styles: TStyles,
    quiz: IQuizes,
    // Só no embed (quiz dentro de um iframe em outro site): a sessão vai por token em vez
    // de cookie e o resultado é entregue aqui em vez de seguir para /quiz/[id]/results.
    onFinish?: (score: IQuizScore) => void
    // anúncio entre o cronômetro e as questões (o embed não passa nenhum)
    adTop?: ReactNode
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

export default function TakingComponent({ quiz, styles, onFinish, adTop }: IProps) {
    const [started, setStarted] = useState<boolean>(false),
        [initialTime, setInitialTime] = useState<number>(0),
        [result, setResult] = useState<{ quizAnswer: any; guest?: string }>(),
        { setError } = useGlobalMessage(),
        [loadingReq, setLoadingReq] = useState<boolean>(false),
        route = useRouter(),
        [finalTime, setFinalTime] = useState(0),
        sessionToken = useRef<string | undefined>(undefined),
        // só para o Analytics: saber se quem saiu da página largou o quiz no meio
        progress = useRef({ started: false, finished: false, answered: 0, startedAt: 0 })

    const t = useTranslations('takingPage')
    const handleStart = async () => {
        const { ok, token } = await startQuiz(quiz.quizId, !!onFinish)
        if (!ok) return setError('Could not start the quiz. Please try again.')
        sessionToken.current = token
        setInitialTime(Date.now())
        setStarted(true)
        progress.current = { started: true, finished: false, answered: 0, startedAt: Date.now() }
        trackEvent('quiz_start', quizParams(quiz))
    }

    const handlePause = async () => {
        const { token } = await pauseQuiz(quiz.quizId, sessionToken.current)
        // num segundo clique em "Resultados" o tempo já está fechado: vale o token anterior
        if (token) sessionToken.current = token
    }

    const handleQuestionAnswered = (questionNumber: number, answered: number) => {
        progress.current.answered = answered
        trackEvent('quiz_progress', {
            ...quizParams(quiz),
            question_number: questionNumber,
            questions_answered: answered,
        })
    }

    useEffect(() => {
        const reportAbandon = () => {
            const { started, finished, answered, startedAt } = progress.current
            if (!started || finished) return

            progress.current.finished = true
            trackEvent('quiz_abandon', {
                ...quizParams(quiz),
                questions_answered: answered,
                time_seconds: Math.round((Date.now() - startedAt) / 1000),
            })
        }

        // fechar a aba/recarregar (pagehide) ou sair para outra página do site (desmontar)
        window.addEventListener('pagehide', reportAbandon)
        return () => {
            window.removeEventListener('pagehide', reportAbandon)
            reportAbandon()
        }
    }, [])

    const handleScroll = () => window.scrollTo({ top: 350, behavior: 'smooth' })

    useEffect(() => {
        if (result && quiz) {
            // só agora: ligado antes, o overlay cobria o popup de visitante e engolia os cliques
            setLoadingReq(true)
            takeQuiz(quiz.quizId, result, sessionToken.current)
                .then(({ err, res }) => {
                    if (err) return setError(err)
                    if (res) {
                        const played = res.userForLeaderBoard
                        const [correct, total] = String(played?.score ?? '').split('/').map(Number)

                        progress.current.finished = true
                        trackEvent('quiz_complete', {
                            ...quizParams(quiz),
                            score: correct,
                            score_percent: total ? Math.round(correct / total * 100) : undefined,
                            time_seconds: Math.round((played?.timing ?? 0) / 1000),
                            player_type: played?.isGuest ? 'guest' : 'user',
                        })

                        if (onFinish) return onFinish(res)
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
            {adTop}
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
                        initialTime={initialTime}
                        typeOfQuiz={quiz?.type}
                        handleScroll={handleScroll}
                        started={started}
                        setStarted={setStarted}
                        pauseQuiz={handlePause}
                        guestOnly={!!onFinish}
                        setResult={setResult}
                        onQuestionAnswered={handleQuestionAnswered}
                        finalTime={finalTime}
                        setFinalTime={setFinalTime}
                    />}
                </div>
            </div>
        </>
    )
}