'use client'
import { verifyUserPremium } from '@/app/[locale]/(quizGroup)/profile/config/actions'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { useUser } from '@/contexts/userContext'
import { ILocalQuestions } from '@/interfaces/ILocalQuestions'
import { TStyles } from '@/types/stylesType'
import { useRouter } from '@/i18n/navigation'
import React, { FormEvent, useEffect, useLayoutEffect, useRef, useState } from 'react'
import QuestionInput from './question-input'
import { createQuestionsImage, createQuestionsText } from '@/app/[locale]/(quizGroup)/(createQuiz)/create/quiz/questions/[quizId]/actions'
import useQuestions from '@/hooks/useQuestions'
import QuestionInputImage from './question-input-image'
import { useLocale, useTranslations } from 'next-intl'
import LoadingReq from '@/components/Loading/loading-req'

interface IProps{
    styles: TStyles
    textMode: boolean,
    quizId: string
}
export interface IFormatedImageQuestions{
    questionId: string;
    title: string;
    answers: {
        answer: string;
        thumbnail: string;
    }[];
    correctAnswer: string;
}

export default function FormCreateQuestions({styles, textMode, quizId}:IProps) {
    const t = useTranslations('creatingQuiz.questionsForm')
    const locale = useLocale()
    const router = useRouter(),
        {setError} = useGlobalMessage(),
        {token} = useUser(),

        [loading, setLoading] = useState<boolean>(false),

        {
            questions, addAlternative, addQuestion,
            handleAlternativeChange, handleQuestionChange, removeAlternative,
            removeQuestion, hasImages, handleMultipleImageUpload
        } = useQuestions(textMode, `${token}`),

        prevQuestionsLengthRef = useRef(questions.length)

    //format to send to API
    const handleFormatTextMode = () =>{
        return questions?.map(q=>{
            const ans = q.alternatives?.filter((a, index) => index !== 0) ,
                answers = ans.map(a=> a.answer)
            return {
                questionId: q.id,
                question: q.title || '',
                answers,
                correctAnswer: q.alternatives[0].answer || ''
            }
        })
    },
    handleFormatImageMode = (): IFormatedImageQuestions[] =>{
        return questions?.map(q=>{
            const answers = q.alternatives?.map(ans=>({
                answer:ans.id,
                thumbnail:''
            }))  
            return {
                questionId: q.id,
                title: q.title || '',
                answers,
                correctAnswer: q.alternatives[0].id || ''
            }
        })
    }

    const handleSubmit = (e:FormEvent) =>{
        e.preventDefault()
        setLoading(true)

        if(textMode){
            const questionsFormated = handleFormatTextMode(),
                questionsObj = {
                    questions: [...questionsFormated]
                }
            
            createQuestionsText(`${token}`, JSON.stringify(questionsObj), quizId)
                .then(({err, res})=>{
                    if(err) {
                        if(err.data.type == 'global' || err.data.type == 'server') setError('')
                        if(err.data.invalidQuestions) {
                            err.data.invalidQuestions.forEach((q: { questionId: string; message: string, messagePT:string})=>{
                                locale == 'pt' 
                                ? handleQuestionChange(q.questionId, 'errorMessage', q.messagePT)
                                : handleQuestionChange(q.questionId, 'errorMessage', q.message)
                            })
                        }
                    }else{
                        if (res) router.push(`/create/quiz/completed/${quizId}`)
                    }
                })
                .finally(()=>{
                    setLoading(false)
                })
        }else{
            const questionsFormated = handleFormatImageMode(),
                questionsObj = {
                    questions: [...questionsFormated]
                },
                canSend = hasImages()

            if(!canSend) return setError(t('errors'))

            createQuestionsImage(`${token}`, quizId, questions, questionsObj)
                .then(({err, res})=>{
                    if(err) {
                        if(err.data.type == 'global' || err.data.type == 'server') setError('')
                        if(err.data.invalidQuestions) {
                            err.data.invalidQuestions.forEach((q: { questionId: string; message: string, messagePT:string})=>{
                                locale == 'pt' 
                                ? handleQuestionChange(q.questionId, 'errorMessage', q.messagePT)
                                : handleQuestionChange(q.questionId, 'errorMessage', q.message)
                            })
                        }
                    }else{
                        const results = res?.map(r=>{
                            if(r.data.type) {
                                setError(r.data.message)
                                return 1
                            }else{return 0}
                        })
                        if(!results?.some(r=>r === 1)){
                            router.push(`/create/quiz/completed/${quizId}`)
                        }
                    }
                })
                .finally(()=>{
                    setLoading(false)
                })

        }
    }

    useLayoutEffect(()=>{
        const currentLength = questions.length

        if(currentLength > prevQuestionsLengthRef.current) window.scrollTo({top: document.body.scrollHeight, behavior:'smooth'})

        prevQuestionsLengthRef.current = currentLength
    },[questions?.length])

    return (
        <form className={styles.form} onSubmit={handleSubmit}>

            {loading && <LoadingReq loading={loading}/>}

            <div className={styles.questions_container}>
                {questions?.map((q, i, arr)=>{
                    if (textMode){
                        return <QuestionInput 
                            key={q.id}
                            question={q}
                            position={i+1}
                            questions={arr}
                            onTitleChange={(title:string) => handleQuestionChange(q.id, 'title', title)}
                            onAddAlternative={()=> addAlternative(q.id)}
                            onAddQuestion={()=>addQuestion()}
                            onRemoveAlternative={(altIndex: number)=>removeAlternative(q.id, altIndex)}
                            onRemoveQuestion={()=>removeQuestion(q.id)}  
                            onAlternativeChange={(altIndex: number, answer:string) => handleAlternativeChange(q.id, altIndex, 'answer', answer)}  
                            />
                    }else{
                        return <QuestionInputImage 
                            key={q.id}
                            question={q}
                            position={i+1}
                            questions={arr}
                            onAddAlternative={()=>addAlternative(q.id)}
                            onAddQuestion={()=>addQuestion()}
                            onRemoveAlternative={(altIndex:number)=>removeAlternative(q.id, altIndex)}
                            onRemoveQuestion={()=>removeQuestion(q.id)}
                            onTitleChange={(title:string)=>handleQuestionChange(q.id, 'title', title)}
                            onQuestionImageChange={(file:string | File)=> handleQuestionChange(q.id, 'image', file)}
                            onAlternativeImageChange={(altIndex: number, file: File | string)=>handleAlternativeChange(q.id, altIndex, 'thumbnail', file)}
                            onMultipleImageUpload={(files) => handleMultipleImageUpload(q.id, files)}
                        />
                    }
                })}
            </div>

            <footer className={styles.footer}>
                <div className={styles.actions}>
                    <button onClick={()=>router.back()}>{t('backButton')}</button>
                </div>
                <div className={styles.save}>
                    <input type='submit' value={t('saveDraftButton')} disabled={loading} />
                    <input type="submit" value={t('createButton')} disabled={loading} />
                </div>
            </footer>
        </form>
    )
}
