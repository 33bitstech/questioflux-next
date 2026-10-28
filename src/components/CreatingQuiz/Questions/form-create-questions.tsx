'use client'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { TStyles } from '@/types/stylesType'
import { useRouter } from '@/i18n/navigation'
import { FormEvent, useLayoutEffect, useRef, useState } from 'react'
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
import { getLocalizedMessage } from '@/utils/getLocalizedMessage'
import { editQuiz } from '@/app/[locale]/(quizGroup)/(editQuiz)/quiz/edit/[quizId]/action'
import VisibilityPopup from './visibility-popup'
import { trackEvent } from '@/utils/analytics'
import { QuizKind } from '@/utils/quizKind'
import { IAnswerExplanation } from '@/interfaces/IQuestion'
import { getLocalExplanations } from '@/utils/questionExplanations'
import AboutMeSuggestions from './about-me-suggestions'
import { IPersonalityResult } from '@/interfaces/IQuizes'
import { getAnswerResults, toResultOptions } from '@/utils/personalityQuestions'
import { IAnswerResult } from '@/interfaces/IQuestion'
import { Link } from '@/i18n/navigation'

interface IProps {
    styles: TStyles
    textMode: boolean,
    quizId: string
    isPrivate?: boolean
    kind?: QuizKind
    personalityResults?: IPersonalityResult[]
}

export interface IFormatedImageQuestions {
    questionId: string
    title: string
    answers: {
        answer: string
        thumbnail: string
        text: string
    }[]
    correctAnswer: string
    explanations?: IAnswerExplanation[]
    answerResults?: IAnswerResult[]
}

export default function FormCreateQuestions({ styles, textMode, quizId, isPrivate, kind = 'quiz', personalityResults }: IProps) {
    const t = useTranslations('creatingQuiz.questionsForm')
    const locale = useLocale()
    const router = useRouter(),
        { setError } = useGlobalMessage(),

        {
            questions, addAlternative, addQuestion,
            handleAlternativeChange, handleQuestionChange, removeAlternative,
            removeQuestion, hasImages, handleMultipleImageUpload,
            setQuestions
        } = useQuestions(textMode),

        [loading, setLoading] = useState<boolean>(false),
        [showVisibilityPopup, setShowVisibilityPopup] = useState<boolean>(false),
        // null = ainda não perguntamos se o quiz privado deve virar público
        [makePublic, setMakePublic] = useState<boolean | null>(null),
        prevQuestionsLengthRef = useRef(questions.length),
        questionRefs = useRef<Record<string, HTMLDivElement | null>>({}),
        isExam = kind === 'exam',
        // personalidade: sem certa; cada alternativa leva a um dos resultados da capa
        isPersonality = kind === 'personality',
        resultOptions = toResultOptions(personalityResults)

    // quiz sobre mim: a sugestão escolhida entra na primeira pergunta ainda sem título
    const handlePickSuggestion = (title: string) => {
        const emptyQuestion = questions.find(question => !question.title.trim())

        if (emptyQuestion) handleQuestionChange(emptyQuestion.id, 'title', title)
        else addQuestion(title)
    }

    const handleFormatTextMode = () => {
        if (isPersonality) {
            return questions.map(q => ({
                questionId: q.id,
                question: q.title || '',
                answers: q.alternatives.map(a => a.answer || ''),
                correctAnswer: '',
                answerResults: getAnswerResults(q, 'text', resultOptions),
            }))
        }

        return questions?.map(q => {
            const ans = q.alternatives?.filter((_, index) => index !== 0),
                answers = ans.map(a => a.answer)
            return {
                questionId: q.id, question: q.title || '', answers, correctAnswer: q.alternatives[0].answer || '',
                explanations: getLocalExplanations(q, 'text')
            }
        })
    }
    const clearQuestionsErrors = () => {
        setQuestions(prevQuestions =>
            prevQuestions.map(question => ({
                ...question,
                errorMessage: ''
            }))
        )
    }
    const handleFormatImageMode = (questionsToFormat = questions): IFormatedImageQuestions[] => {
        return questionsToFormat?.map(q => {
            // A imagem sobe depois, alternativa por alternativa. Até lá vai "pending-upload":
            // com "" o backend recusava alternativa só com imagem (exige texto ou imagem).
            const answers = q.alternatives?.map(ans => ({
                answer: ans.id,
                thumbnail: ans.thumbnail ? 'pending-upload' : '',
                text: ans.text?.trim() || ''
            }))

            return {
                questionId: q.id,
                title: q.title || '',
                answers,
                correctAnswer: isPersonality ? '' : q.alternatives[0].id || '',
                ...(isPersonality
                    ? { answerResults: getAnswerResults(q, 'image', resultOptions) }
                    : { explanations: getLocalExplanations(q, 'image') })
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

    // finalize: "Criar" tira o quiz do rascunho; "Salvar como rascunho" deixa como está.
    // publish: a pessoa escolheu no popup tornar público o quiz que estava privado.
    const finishCreation = async (finalize: boolean, publish: boolean) => {
        let isPublic = !isPrivate

        if (!finalize) {
            router.push('/drafts')
            return
        }

        const formData = new FormData()
        formData.append('quizDatas', JSON.stringify({ quizData: { draft: false, ...(publish ? { isPrivate: false } : {}) } }))

        const result = await editQuiz(formData, quizId)

        if (result.ok) isPublic = isPublic || publish
        else setError(publish ? t('visibilityPopup.publishError') : t('finalizeError'))

        trackEvent('quiz_create_complete', {
            quiz_id: quizId,
            quiz_type: textMode ? 'text' : 'image',
            quiz_kind: kind,
            quiz_questions: questions.length,
            visibility: isPublic ? 'public' : 'private',
        })

        router.push(`/create/quiz/completed/${quizId}`)
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLInputElement | null
        const isDraft = submitter?.name === 'draft'

        if (isPrivate && !isDraft && makePublic === null) {
            setShowVisibilityPopup(true)
            return
        }

        await saveQuestions(!isDraft, !isDraft && makePublic === true)
    }

    const handleVisibilityChoice = async (publish: boolean) => {
        setShowVisibilityPopup(false)
        setMakePublic(publish)
        trackEvent('quiz_visibility_prompt', { quiz_id: quizId, choice: publish ? 'make_public' : 'keep_private' })
        await saveQuestions(true, publish)
    }

    const saveQuestions = async (finalize: boolean, publish: boolean) => {
        clearQuestionsErrors()
        setLoading(true)

        const handleApiError = (err: any) => {
            const invalidQuestions = err?.data?.invalidQuestions as
                | {
                    questionId: string
                    message: string
                    messagePT?: string
                    messagePt?: string
                    messageES?: string
                    messageEs?: string
                }[]
                | undefined

            if (Array.isArray(invalidQuestions) && invalidQuestions.length > 0) {
                invalidQuestions.forEach((q) => {
                    handleQuestionChange(
                        q.questionId,
                        'errorMessage',
                        getLocalizedMessage(
                            {
                                message: q.message,
                                messagePT: q.messagePT || q.messagePt,
                                messageES: q.messageES || q.messageEs,
                            },
                            locale,
                            q.message
                        )
                    )
                })

                setError(t('validationError'))

                scrollToQuestionError(invalidQuestions[0]?.questionId)

                return
            }

            if (err?.data?.type === 'global' || err?.data?.type === 'server') {
                setError(
                    getLocalizedMessage(
                        {
                            message: err.data.message,
                            messagePT: err.data.messagePT || err.data.messagePt,
                            messageES: err.data.messageES || err.data.messageEs,
                        },
                        locale,
                        t('errors')
                    )
                )

                return
            }

            setError(t('errors'))
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
                    await finishCreation(finalize, publish)
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

            await finishCreation(finalize, publish)
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

            {showVisibilityPopup && (
                <VisibilityPopup
                    onChoose={handleVisibilityChoice}
                    onClose={() => setShowVisibilityPopup(false)}
                />
            )}

            {kind === 'aboutMe' && (
                <AboutMeSuggestions
                    usedTitles={questions.map(question => question.title)}
                    onPick={handlePickSuggestion}
                />
            )}

            {isExam && <p className={styles.exam_hint}>{t('explanation.hint')}</p>}

            {isPersonality && (
                <p className={styles.exam_hint}>
                    {resultOptions.length >= 2
                        ? t('personality.hint')
                        : <>{t('personality.noResults')} <Link href={`/quiz/edit/${quizId}`}>{t('personality.editCover')}</Link></>}
                </p>
            )}

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
                                    showExplanations={isExam}
                                    onAlternativeExplanationChange={(altIndex: number, text: string) =>
                                        handleAlternativeChange(q.id, altIndex, 'explanation', text)
                                    }
                                    resultOptions={isPersonality ? resultOptions : undefined}
                                    onAlternativeResultChange={(altIndex: number, resultId: string) =>
                                        handleAlternativeChange(q.id, altIndex, 'resultId', resultId)
                                    }
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
                                    onAlternativeImageChange={(altIndex: number, file: File | string) =>
                                        handleAlternativeChange(q.id, altIndex, 'thumbnail', file)
                                    }
                                    onAlternativeTextChange={(altIndex: number, text: string) =>
                                        handleAlternativeChange(q.id, altIndex, 'text', text)
                                    }
                                    onMultipleImageUpload={(files) => handleMultipleImageUpload(q.id, files)}
                                    onAlternativeImageClear={(altIndex: number) =>
                                        handleAlternativeChange(q.id, altIndex, 'thumbnail', '')
                                    }
                                    showExplanations={isExam}
                                    onAlternativeExplanationChange={(altIndex: number, text: string) =>
                                        handleAlternativeChange(q.id, altIndex, 'explanation', text)
                                    }
                                    resultOptions={isPersonality ? resultOptions : undefined}
                                    onAlternativeResultChange={(altIndex: number, resultId: string) =>
                                        handleAlternativeChange(q.id, altIndex, 'resultId', resultId)
                                    }
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
                    <input type='submit' name='draft' value={t('saveDraftButton')} disabled={loading} />
                    <input type="submit" value={t('createButton')} disabled={loading} />
                </div>
            </footer>
        </form>
    )
}