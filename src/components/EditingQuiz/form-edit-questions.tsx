'use client'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { useUser } from '@/contexts/userContext'
import useQuestions from '@/hooks/useQuestions'
import IQuizes from '@/interfaces/IQuizes'
import { TStyles } from '@/types/stylesType'
import {Link} from '@/i18n/navigation'
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

interface IProps{
    styles: TStyles,
    quiz: IQuizes | undefined | any,
    quizId: string
}
export interface IArraysToUpdate{
    questionsToUpdate: {
        questionId:string
    }[],
    alternativesToUpdate: {
        id: string, 
        file: File | string,
        questionId: string
    }[]
}

export default function FormEditQuestions({styles, quiz, quizId}: IProps) {
    const t = useTranslations('editQuizFlow')
    const locale = useLocale()

    const router = useRouter(),
        {token} = useUser(),
        {setError, setSucess} = useGlobalMessage(),
        [showWarning, setShowWarning] = useState<boolean>(false),

        {
            questions, addAlternative, addQuestion,
            handleAlternativeChange, handleQuestionChange, 
            removeAlternative, removeQuestion, setQuestions
        } = useQuestions(quiz?.type === 'default/RW', `${token}`),


        [loading, setLoading] = useState<boolean>(false),
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
    handleFormatImageMode = () =>{
        return questions?.map(q=>{
            const answers = q.alternatives?.map(ans=>({
                answer: ans.id,
                thumbnail: typeof ans.thumbnail === 'string' ? ans.thumbnail : ''
            }))
            return {
                questionId: q.id,
                title: q.title || '',
                answers,
                correctAnswer: q.alternatives[0].id || '',
                image: typeof q.image === 'string' ? q.image : ''
            }
        })
    },
    willResetLb = () =>{
        let cancel = false
        if(quiz?.questions?.length != questions.length){
            cancel = true
        }else{
            cancel = false
        }
        quiz?.questions?.forEach((q:any, i:any)=>{
            if(q.answers.length + (quiz.type=== 'default/RW'? 1 : 0) != questions[i].alternatives.length){
                cancel=true
            }else{
                cancel=false
            }
        })
        if (cancel) {
            setShowWarning(true)
        }else{
            setShowWarning(false)
            sendDatas()
        }
    }

    const handleSubmit = (e:FormEvent)=>{
        e.preventDefault()

        willResetLb()
    },
    sendDatas = () =>{
        setLoading(true)
        if(quiz?.type === 'default/RW'){
            const questionsFormated = handleFormatTextMode(),
                questionsObj = {
                    questions: [...questionsFormated]
                }
            
            createQuestionsText(`${token}`, JSON.stringify(questionsObj), quiz.quizId)
                .then(({err, res})=>{
                    if(err) {
                        if(err.data.type == 'global' || err.data.type == 'server') setError('')
                        if(err.data.invalidQuestions) {
                            err.data.invalidQuestions.forEach((q: { questionId: string; message: string, messagePt:string})=>{
                                handleQuestionChange(q.questionId, 'errorMessage', q.message)
                            })
                        }
                    }else{
                        if (res) setSucess(t('form.successMessage'))
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
                dataToSubmit : IArraysToUpdate = {
                    questionsToUpdate: [],
                    alternativesToUpdate: []
                }
            questions.forEach(q=>{
                if(q.isNew){
                    dataToSubmit.questionsToUpdate.push({questionId:q.id})
                }
                q.alternatives.forEach(a=>{
                    if(a.isNew && a.thumbnail instanceof File){
                        dataToSubmit.alternativesToUpdate.push({
                            id: a.id,
                            file: a.thumbnail,
                            questionId: q.id
                        })
                    }
                })
            })
            updateQuestionsImage(`${token}`, quizId, questions, questionsObj, dataToSubmit)
                .then(({res})=>{
                    if(res) {
                        console.log(res)
                        setSucess(t('form.successMessage'))
                    }
                })
                .finally(()=>{
                    setLoading(false)
                })
        }
    }

    useEffect(()=>{
        if(quiz && quiz.questions){
            if(quiz.type === 'default/RW'){
                const newQuestions : ILocalQuestions[] = quiz.questions?.map((q:any)=>{
                    const ans = [q.correctAnswer, ...q.answers],
                        alternatives = ans.map((a, i) => ({
                            id: `a-${Date.now()}${i+1}`,
                            answer: typeof a === 'string' ? a : (a?.answer ?? ''),
                            isNew: false
                        }))
                    return {
                        id: q.questionId,
                        type: quiz.type === 'default/RW' ? 'text':'image',
                        title: q.question,
                        isNew: false,
                        alternatives
                    }
                })
                setQuestions(newQuestions)
            
                prevQuestionsLengthRef.current = newQuestions.length
            }else{
                const newQuestions : ILocalQuestions[] = quiz.questions?.map((q:any)=>{
                    const alternatives = q.answers.map((a:any, i:any) => ({
                            id: typeof a === 'string' ? a : (a?.answer ?? ''),
                            thumbnail: typeof a === 'string' ? a : (a?.thumbnail ?? ''),
                            isNew: false
                        }))
                    return {
                        id: q.questionId,
                        type: quiz.type === 'default/RW' ? 'text':'image',
                        title: q.title ?? '',
                        image: q.image,
                        isNew: false,
                        alternatives
                    }
                })
                setQuestions(newQuestions)
            
                prevQuestionsLengthRef.current = newQuestions.length
            }
        }
    },[quiz, setQuestions])


    useLayoutEffect(()=>{
        const currentLength = questions.length

        if(currentLength > prevQuestionsLengthRef.current) window.scrollTo({top: document.body.scrollHeight, behavior:'smooth'})

        prevQuestionsLengthRef.current = currentLength
    },[questions?.length])

    return (
        <form className={styles.form} onSubmit={handleSubmit}>

            {showWarning && <>
                <WarningReset
                    cancelFunction={()=>setShowWarning(false)}
                    confirmFunction={()=>{
                        sendDatas()
                        setShowWarning(false)
                    }}
                    cancelValue={t('warningReset.cancelButton')}
                    confirmValue={t('warningReset.confirmButton')}
                    title={t('warningReset.title')}
                    description={t('warningReset.description')}
                />
                <div className={styles.overlay_warning}/>
            </>}

            {loading && <LoadingReq loading={loading}/>}
            
            <div className={styles.questions_container}>
                {questions?.map((q, i, arr)=>{
                    if (quiz?.type === 'default/RW'){
                        return <QuestionInput 
                            key={q.id}
                            question={q}
                            questions={arr}
                            position={i+1}
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
                        />
                    }
                })}
            </div>

            <footer className={styles.footer}>
                <div className={styles.actions}>
                    <button onClick={(e)=>{
                        e.preventDefault()
                        router.back()
                    }}>{t('buttons.back')}</button>
                </div>
                <div className={styles.save}>
                    <Link href={`/quiz/edit/${quiz?.quizId}`}>{t('buttons.editQuiz')}</Link>
                    <input disabled={loading} type="submit" value={t('buttons.saveChanges')} />
                </div>
            </footer>
        </form>
    )
}
