'use client'
import QuizCard from '@/components/Card/quiz-card'
import ArrowSvg from '@/components/Icons/ArrowSvg'
import { useUser } from '@/contexts/userContext'
import useGettingQuiz from '@/hooks/requests/quiz-requests/useGettingQuiz'
import IQuizes from '@/interfaces/IQuizes'
import { IUser } from '@/interfaces/IUser'
import { TStyles } from '@/types/stylesType'
import React, { useEffect, useState } from 'react'

interface IProps{
    styles: TStyles,
    quizzes_type: 'public' | 'private' | 'draft' | 'saved',
    customTitle?: string,
    userP?: IUser
}

export default function ContainerUserQuizzes({styles, quizzes_type, customTitle, userP}: IProps) {
    const {token, user} = useUser(),
        {userPublicQuizzes, userPrivateQuizzes, userDraftsQuizzes, userSavesQuizzes} = useGettingQuiz(),
        [quizzes, setQuizzes] = useState<IQuizes[]>(),
        [viewQuizzes, setViewQuizzes] = useState<boolean>(false)

    useEffect(()=>{
        const get = async ()=>{
            if(user && token){
                const actions = {
                    public:{
                        action: async () => {
                            if(userP && userP.userId){
                                const res = await userPublicQuizzes(userP.userId)
                                if (res) setQuizzes(res.quizes)
                                return
                            }
                            if (user.userId) {
                                const res = await userPublicQuizzes(user.userId)
                                if (res) setQuizzes(res.quizes)
                                return
                            } 
                        },
                    },
                    private: {
                        action: async () => {
                            const res = await userPrivateQuizzes(token)
                            if (res) setQuizzes(res.quizzes)
                        },
                    },
                    draft: {
                        action: async () => {
                            const res = await userDraftsQuizzes(token)
                            if (res) setQuizzes(res.quizzes)
                        },
                    },
                    saved: {
                        action: async () => {
                            const res = await userSavesQuizzes(token)
                            if (res) setQuizzes(res.quizzes)
                        },
                    }
                }
    
                await actions[quizzes_type].action()
            }
        }

        get()

    }, [token, user])


    if(quizzes_type == 'public' || quizzes_type == 'private'){
        return (
            <>
                <h2>
                    {`${customTitle 
                        ? `${customTitle}` 
                        : `Your ${quizzes_type} quizzes`} 
                    
                    (${quizzes?.length || 0})`}
                </h2>
                <section className={styles.quizes}>
                        {user && Array.isArray(quizzes) && quizzes?.slice(0,3).map((quiz, index)=>(
                            <QuizCard 
                                key={index} 
                                quiz={quiz}
                            />
                        ))}
                    </section>

                    {Array.isArray(quizzes) && quizzes?.length > 3 && (
                        <button onClick={()=>setViewQuizzes(!viewQuizzes)} 
                        className={`${styles.seemore_button} ${viewQuizzes ? styles.active : ''}`}>
                            <p>
                                See {viewQuizzes ? 'less': 'more'}
                            </p>
                            <ArrowSvg/>
                        </button>
                    )}
                    {viewQuizzes && (
                        <div className={styles.more_content}>
                            <section className={styles.quizes}>
                                {user && Array.isArray(quizzes) && quizzes?.slice(3,).map((quiz, index)=>(
                                    <QuizCard 
                                        key={index} 
                                        quiz={quiz}
                                    />
                                ))}
                            </section>
                            <div className={styles.end_of_content}></div>
                        </div>
                    )}
            </>
        )
    }
    if(quizzes_type == 'draft' || quizzes_type == 'saved'){
        return (
            <>
                <h1>
                    {`${customTitle 
                        ? `${customTitle}` 
                        : `Your ${quizzes_type} quizzes`} 
                    
                    (${quizzes?.length || 0})`}
                </h1>
                <div className={styles.quizes_container}>
                    {quizzes?.map((quiz, index)=>(
                        <QuizCard
                            key={index} 
                            quiz={quiz}
                        />
                    ))}
                </div>
            </>
        )
    }

    return null
}
