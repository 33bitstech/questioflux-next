'use client'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { useUser } from '@/contexts/userContext'
import useQuestions from '@/hooks/useQuestions'
import IQuizes from '@/interfaces/IQuizes'
import { TStyles } from '@/types/stylesType'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { FormEvent, useEffect, useLayoutEffect, useRef, useState } from 'react'
import QuestionInput from '../CreatingQuiz/Questions/question-input'
import { ILocalQuestions } from '@/interfaces/ILocalQuestions'
import { createQuestionsText } from '@/app/(quizGroup)/(createQuiz)/create/quiz/questions/[quizId]/actions'
import WarningReset from '../widgets/warning-reset'

interface IProps{
    styles: TStyles,
    quiz: IQuizes | undefined
}

export default function FormEditQuestions({styles, quiz}: IProps) {
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
    },
    willResetLb = () =>{
        let cancel = false
        if(quiz?.questions?.length != questions.length){
            cancel = true
        }else{
            cancel = false
        }
        quiz?.questions?.forEach((q, i)=>{
            if(q.answers.length + 1 != questions[i].alternatives.length){
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
                        if (res) setSucess('Quiz edited sucessfully !')
                    }
                })
                .finally(()=>{
                    setLoading(false)
                })
        }else{

        }
    }

    useEffect(()=>{
        if(quiz && quiz.questions){
            const newQuestions : ILocalQuestions[] = quiz.questions?.map(q=>{
                const ans = [q.correctAnswer, ...q.answers],
                    alternatives = ans.map((a, i) => ({
                        id: `a-${Date.now()}${i+1}`,
                        answer: typeof a === 'string' ? a : (a?.answer ?? '')
                    }))
                return {
                    id: q.questionId,
                    type: quiz.type === 'default/RW' ? 'text':'image',
                    title: q.question,
                    alternatives
                }
            })
            setQuestions(newQuestions)
        
            prevQuestionsLengthRef.current = newQuestions.length
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
                    cancelValue='Cancel'
                    confirmValue='Save Changes'
                    title='Warning!'
                    description='If you edit the quiz, the entire leaderboard will be reset. Are you sure you want to proceed with editing?'
                />
                <div className={styles.overlay_warning}/>
            </>}
            
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
                        return <></>
                    }
                })}
            </div>

            <footer className={styles.footer}>
                <div className={styles.actions}>
                    <button onClick={(e)=>{
                        e.preventDefault()
                        router.back()
                    }}>Back</button>
                </div>
                <div className={styles.save}>
                    <Link href={`/quiz/edit/${quiz?.quizId}`}>Edit Quiz</Link>
                    <input disabled={loading} type="submit" value="Save Changes" />
                </div>
            </footer>
        </form>
    )
}
