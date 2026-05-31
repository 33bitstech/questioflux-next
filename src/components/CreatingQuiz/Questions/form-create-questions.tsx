'use client'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { TStyles } from '@/types/stylesType'
import { useRouter } from '@/i18n/navigation'
import React, { FormEvent, useLayoutEffect, useRef, useState } from 'react'
import QuestionInput from './question-input'
import {
    createQuestionsImageTitles,
    createQuestionsText,
    uploadOneQuestionImage
} from '@/app/[locale]/(quizGroup)/(createQuiz)/create/quiz/questions/[quizId]/actions'
import useQuestions from '@/hooks/useQuestions'
import QuestionInputImage from './question-input-image'
import { useLocale, useTranslations } from 'next-intl'
import LoadingReq from '@/components/Loading/loading-req'

interface IProps {
    styles: TStyles
    textMode: boolean,
    quizId: string
}

export interface IFormatedImageQuestions {
    questionId: string;
    title: string;
    answers: { answer: string; thumbnail: string; }[];
    correctAnswer: string;
}

export default function FormCreateQuestions({ styles, textMode, quizId }: IProps) {
    const t = useTranslations('creatingQuiz.questionsForm')
    const locale = useLocale()
    const router = useRouter(),
        { setError } = useGlobalMessage(),

        {
            questions, addAlternative, addQuestion,
            handleAlternativeChange, handleQuestionChange, removeAlternative,
            removeQuestion, hasImages, handleMultipleImageUpload
        } = useQuestions(textMode),

        [loading, setLoading] = useState<boolean>(false),
        prevQuestionsLengthRef = useRef(questions.length),
        questionRefs = useRef<Record<string, HTMLDivElement | null>>({})

    const handleFormatTextMode = () => {
        return questions?.map(q => {
            const ans = q.alternatives?.filter((_, index) => index !== 0),
                answers = ans.map(a => a.answer)
            return { questionId: q.id, question: q.title || '', answers, correctAnswer: q.alternatives[0].answer || '' }
        })
    }

    const handleFormatImageMode = (questionsToFormat = questions): IFormatedImageQuestions[] => {
        return questionsToFormat?.map(q => {
            const answers = q.alternatives?.map(ans => ({
                answer: ans.id,
                thumbnail: ''
            }))

            return {
                questionId: q.id,
                title: q.title || '',
                answers,
                correctAnswer: q.alternatives[0].id || ''
            }
        })
    }

    const scrollToQuestionError = (questionId?: string) => {
        if (!questionId) return

        requestAnimationFrame(() => {
            questionRefs.current[questionId]?.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        })
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const handleApiError = (err: any) => {
            let hasMessage = false

            if (err?.data?.type === 'global' || err?.data?.type === 'server') {
                hasMessage = true

                setError(
                    locale === 'pt'
                        ? err.data.messagePT || err.data.message
                        : err.data.message
                )
            }

            if (err?.data?.invalidQuestions) {
                hasMessage = true

                const invalidQuestions = err.data.invalidQuestions as {
                    questionId: string
                    message: string
                    messagePT: string
                }[]

                invalidQuestions.forEach((q) => {
                    locale === 'pt'
                        ? handleQuestionChange(q.questionId, 'errorMessage', q.messagePT)
                        : handleQuestionChange(q.questionId, 'errorMessage', q.message)
                })

                scrollToQuestionError(invalidQuestions[0]?.questionId)
            }

            if (!hasMessage) {
                setError(t('errors'))
            }
        }

        try {
            if (textMode) {
                const questionsFormated = handleFormatTextMode()
                const questionsObj = { questions: [...questionsFormated] }

                const { err, res } = await createQuestionsText(JSON.stringify(questionsObj), quizId)

                if (err) {
                    handleApiError(err)
                    return
                }

                if (res) {
                    router.push(`/create/quiz/completed/${quizId}`)
                }

                return
            }

            const canSend = hasImages()

            if (!canSend) {
                setError(t('errors'))
                return
            }

            const questionsFormated = handleFormatImageMode()
            const questionsObj = { questions: [...questionsFormated] }

            const titlesResult = await createQuestionsImageTitles(quizId, questionsObj)

            if (titlesResult.err) {
                handleApiError(titlesResult.err)
                return
            }

            for (const question of questions) {
                const uploadResult = await uploadOneQuestionImage(quizId, question)

                if (uploadResult.err) {
                    handleApiError(uploadResult.err)
                    return
                }
            }

            router.push(`/create/quiz/completed/${quizId}`)
        } finally {
            setLoading(false)
        }
    }

    useLayoutEffect(() => {
        const currentLength = questions.length
        if (currentLength > prevQuestionsLengthRef.current) window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
        prevQuestionsLengthRef.current = currentLength
    }, [questions?.length])

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            {loading && <LoadingReq loading={loading} />}

            <div className={styles.questions_container}>
                {questions?.map((q, i, arr) => {
                    if (textMode) {
                        return (
                            <div
                                key={q.id}
                                ref={(el) => {
                                    questionRefs.current[q.id] = el
                                }}
                                style={{ scrollMarginTop: '6rem' }}
                            >
                                <QuestionInput
                                    question={q}
                                    position={i + 1}
                                    questions={arr}
                                    onTitleChange={(title: string) => handleQuestionChange(q.id, 'title', title)}
                                    onAddAlternative={() => addAlternative(q.id)}
                                    onAddQuestion={() => addQuestion()}
                                    onRemoveAlternative={(altIndex: number) => removeAlternative(q.id, altIndex)}
                                    onRemoveQuestion={() => removeQuestion(q.id)}
                                    onAlternativeChange={(altIndex: number, answer: string) => handleAlternativeChange(q.id, altIndex, 'answer', answer)}
                                />
                            </div>
                        )
                    } else {
                        return (
                            <div
                                key={q.id}
                                ref={(el) => {
                                    questionRefs.current[q.id] = el
                                }}
                                style={{ scrollMarginTop: '6rem' }}
                            >
                                <QuestionInputImage
                                    question={q}
                                    position={i + 1}
                                    questions={arr}
                                    onAddAlternative={() => addAlternative(q.id)}
                                    onAddQuestion={() => addQuestion()}
                                    onRemoveAlternative={(altIndex: number) => removeAlternative(q.id, altIndex)}
                                    onRemoveQuestion={() => removeQuestion(q.id)}
                                    onTitleChange={(title: string) => handleQuestionChange(q.id, 'title', title)}
                                    onQuestionImageChange={(file: string | File) => handleQuestionChange(q.id, 'image', file)}
                                    onAlternativeImageChange={(altIndex: number, file: File | string) => handleAlternativeChange(q.id, altIndex, 'thumbnail', file)}
                                    onMultipleImageUpload={(files) => handleMultipleImageUpload(q.id, files)}
                                />
                            </div>
                        )
                    }
                })}
            </div>

            <footer className={styles.footer}>
                <div className={styles.actions}>
                    <button onClick={() => router.push(`/quiz/edit/${quizId}`)}>{t('backButton')}</button>
                </div>
                <div className={styles.save}>
                    <input type='submit' value={t('saveDraftButton')} disabled={loading} />
                    <input type="submit" value={t('createButton')} disabled={loading} />
                </div>
            </footer>
        </form>
    )
}