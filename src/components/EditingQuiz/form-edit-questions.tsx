'use client'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import useQuestions from '@/hooks/useQuestions'
import IQuizes from '@/interfaces/IQuizes'
import { TStyles } from '@/types/stylesType'
import { Link } from '@/i18n/navigation'
import { useRouter } from '@/i18n/navigation'
import React, { FormEvent, useEffect, useLayoutEffect, useRef, useState } from 'react'
import QuestionInput from '../CreatingQuiz/Questions/question-input'
import { ILocalQuestions } from '@/interfaces/ILocalQuestions'
import { createQuestionsText } from '@/app/[locale]/(quizGroup)/(createQuiz)/create/quiz/questions/[quizId]/actions'
import WarningReset from '../widgets/warning-reset'
import QuestionInputImage from '../CreatingQuiz/Questions/question-input-image'
import { updateQuestionsImage } from '@/app/[locale]/(quizGroup)/(editQuiz)/quiz/edit/questions/action'
import { useLocale, useTranslations } from 'next-intl'
import LoadingReq from '../Loading/loading-req'

interface IProps {
    styles: TStyles
    quiz: IQuizes | undefined | any
    quizId: string
    textMode?: boolean
}

export interface IArraysToUpdate {
    questionsToUpdate: { questionId: string }[],
    alternativesToUpdate: { id: string, file: File | string, questionId: string }[]
}

type ApiImageAnswer = {
    answer: string
    thumbnail: string
}

type LocalImageAlternative = {
    id: string
    thumbnail: string | File
    isNew?: boolean
    [key: string]: any
}

const isValidApiImageAnswer = (answer: unknown): answer is ApiImageAnswer => {
    return (
        typeof answer === 'object' &&
        answer !== null &&
        !Array.isArray(answer) &&
        'answer' in answer &&
        'thumbnail' in answer
    )
}

const isValidLocalImageAlternative = (alternative: unknown): alternative is LocalImageAlternative => {
    return (
        typeof alternative === 'object' &&
        alternative !== null &&
        !Array.isArray(alternative) &&
        'id' in alternative &&
        'thumbnail' in alternative
    )
}

export default function FormEditQuestions({ styles, quiz, quizId, textMode=true}: IProps) {
    const t = useTranslations('editQuizFlow')
    const locale = useLocale()

    const router = useRouter(),
        { setError, setSucess } = useGlobalMessage(),
        [showWarning, setShowWarning] = useState<boolean>(false),

        {
            questions, addAlternative, addQuestion,
            handleAlternativeChange, handleQuestionChange,
            removeAlternative, removeQuestion, setQuestions,
            handleMultipleImageUpload
        } = useQuestions(textMode),

        [loading, setLoading] = useState<boolean>(false),
        prevQuestionsLengthRef = useRef(questions.length)

    const handleFormatTextMode = () => {
        return questions?.map(q => {
            const ans = q.alternatives?.filter((_, index) => index !== 0),
                answers = ans.map(a => a.answer)
            return { questionId: q.id, question: q.title || '', answers, correctAnswer: q.alternatives[0].answer || '' }
        })
    }

    const handleFormatImageMode = (questionsToFormat: ILocalQuestions[] = questions) => {
        return questionsToFormat?.map(q => {
            const alternatives = Array.isArray(q.alternatives)
                ? q.alternatives.filter(isValidLocalImageAlternative)
                : []

            const answers = alternatives.map(ans => ({
                answer: ans.id,
                thumbnail: typeof ans.thumbnail === 'string' ? ans.thumbnail : ''
            }))

            return {
                questionId: q.id,
                title: q.title || '',
                answers,
                correctAnswer: alternatives[0]?.id || '',
                image: typeof q.image === 'string' ? q.image : ''
            }
        })
    }   

    const willResetLb = () => {
        let cancel = false

        if (quiz?.questions?.length != questions.length) cancel = true
        else {
            quiz?.questions?.forEach((q: any, i: any) => {
                if (quiz.type === 'image/RW') {
                    const apiAnswers = Array.isArray(q.answers) ? q.answers : []
                    const localAlternatives = Array.isArray(questions[i]?.alternatives)
                        ? questions[i].alternatives
                        : []

                    const oldLength = apiAnswers.filter(isValidApiImageAnswer).length
                    const currentLength = localAlternatives.filter(isValidLocalImageAlternative).length

                    if (oldLength != currentLength) cancel = true
                    return
                }

                if (q.answers.length + (quiz.type === 'default/RW' ? 1 : 0) != questions[i].alternatives.length) {
                    cancel = true
                }
            })
        }

        setShowWarning(cancel)
        if (!cancel) return sendDatas()
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        willResetLb()
    }

    const sendDatas = () => {
        setLoading(true)
        if (quiz?.type === 'image/RW') {
            const questionsToSend = questions.map(q => ({
                ...q,
                alternatives: Array.isArray(q.alternatives)
                    ? q.alternatives.filter(isValidLocalImageAlternative)
                    : []
            }))

            const questionsFormated = handleFormatImageMode(questionsToSend),
                questionsObj = { questions: [...questionsFormated] },
                dataToSubmit: IArraysToUpdate = { questionsToUpdate: [], alternativesToUpdate: [] }

            questionsToSend.forEach(q => {
                if (q.isNew) dataToSubmit.questionsToUpdate.push({ questionId: q.id })

                q.alternatives.forEach(a => {
                    if (a.isNew && a.thumbnail instanceof File) {
                        dataToSubmit.alternativesToUpdate.push({
                            id: a.id,
                            file: a.thumbnail,
                            questionId: q.id
                        })
                    }
                })
            })

            updateQuestionsImage(quizId, questionsToSend, questionsObj, dataToSubmit)
                .then(({ res }) => { if (res) setSucess(t('form.successMessage')) })
                .finally(() => setLoading(false))
        } else {
            const questionsFormated = handleFormatTextMode(),
                questionsObj = { questions: [...questionsFormated] }

            createQuestionsText(JSON.stringify(questionsObj), quiz.quizId)
                .then(({ err, res }) => {
                    if (err) {
                        if (err.data.type == 'global' || err.data.type == 'server') setError('')
                        if (err.data.invalidQuestions) {
                            err.data.invalidQuestions.forEach((q: { questionId: string; message: string, messagePt: string }) => {
                                handleQuestionChange(q.questionId, 'errorMessage', q.message)
                            })
                        }
                    } else {
                        if (res) setSucess(t('form.successMessage'))
                    }
                })
                .finally(() => setLoading(false))
        }
    }

    useEffect(() => {
        if (quiz && quiz.questions) {
            if (quiz.type === 'image/RW') {
                const newQuestions: ILocalQuestions[] = quiz.questions?.map((q: any) => {
                    const apiAnswers = Array.isArray(q.answers) ? q.answers : []

                    const alternatives = apiAnswers
                        .filter(isValidApiImageAnswer)
                        .map((a: any) => ({
                            id: a.answer ?? '',
                            thumbnail: a.thumbnail ?? '',
                            isNew: false
                        }))

                    return {
                        id: q.questionId,
                        type: 'image',
                        title: q.title ?? '',
                        image: q.image,
                        isNew: false,
                        alternatives
                    }
                })

                setQuestions(newQuestions)
                prevQuestionsLengthRef.current = newQuestions.length
            } else {
                const newQuestions: ILocalQuestions[] = quiz.questions?.map((q: any) => {
                    const ans = [q.correctAnswer, ...q.answers],
                        alternatives = ans.map((a, i) => ({
                            id: `a-${Date.now()}${i + 1}`,
                            answer: typeof a === 'string' ? a : (a?.answer ?? ''),
                            isNew: false
                        }))
                    return { id: q.questionId, type: 'text', title: q.question, isNew: false, alternatives }
                })
                if (newQuestions.length > 0) setQuestions(newQuestions)
                prevQuestionsLengthRef.current = newQuestions.length
            }
        }
    }, [quiz, setQuestions])

    useLayoutEffect(() => {
        const currentLength = questions.length
        if (currentLength > prevQuestionsLengthRef.current) window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
        prevQuestionsLengthRef.current = currentLength
    }, [questions?.length])

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            {showWarning && <>
                <WarningReset
                    cancelFunction={() => setShowWarning(false)}
                    confirmFunction={() => { sendDatas(); setShowWarning(false) }}
                    cancelValue={t('warningReset.cancelButton')}
                    confirmValue={t('warningReset.confirmButton')}
                    title={t('warningReset.title')}
                    description={t('warningReset.description')}
                />
                <div className={styles.overlay_warning} />
            </>}

            {loading && <LoadingReq loading={loading} />}

            <div className={styles.questions_container}>
                {questions?.map((q, i, arr) => {
                    if (quiz?.type === 'image/RW') {
                        return <QuestionInputImage
                            key={q.id} question={q} position={i + 1} questions={arr}
                            onAddAlternative={() => addAlternative(q.id)}
                            onAddQuestion={() => addQuestion()}
                            onRemoveAlternative={(altIndex: number) => removeAlternative(q.id, altIndex)}
                            onRemoveQuestion={() => removeQuestion(q.id)}
                            onTitleChange={(title: string) => handleQuestionChange(q.id, 'title', title)}
                            onQuestionImageChange={(file: string | File) => handleQuestionChange(q.id, 'image', file)}
                            onAlternativeImageChange={(altIndex: number, file: File | string) => handleAlternativeChange(q.id, altIndex, 'thumbnail', file)}
                            onMultipleImageUpload={(files) => handleMultipleImageUpload(q.id, files)}
                        />
                    } else {
                        return <QuestionInput
                            key={q.id} question={q} questions={arr} position={i + 1}
                            onTitleChange={(title: string) => handleQuestionChange(q.id, 'title', title)}
                            onAddAlternative={() => addAlternative(q.id)}
                            onAddQuestion={() => addQuestion()}
                            onRemoveAlternative={(altIndex: number) => removeAlternative(q.id, altIndex)}
                            onRemoveQuestion={() => removeQuestion(q.id)}
                            onAlternativeChange={(altIndex: number, answer: string) => handleAlternativeChange(q.id, altIndex, 'answer', answer)}
                        />
                    }
                })}
            </div>

            <footer className={styles.footer}>
                <div className={styles.actions}>
                    <button onClick={(e) => { e.preventDefault(); router.back() }}>{t('buttons.back')}</button>
                </div>
                <div className={styles.save}>
                    <Link href={`/quiz/edit/${quiz?.quizId}`}>{t('buttons.editQuiz')}</Link>
                    <input disabled={loading} type="submit" value={t('buttons.saveChanges')} />
                </div>
            </footer>
        </form>
    )
}