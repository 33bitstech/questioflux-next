'use client'
import React from 'react'

import styles from './card-actions.module.scss'
import Link from 'next/link'
import { useUser } from '@/contexts/userContext'
import { getCookie } from 'cookies-next/client'
import useQuizActions from '@/hooks/requests/quiz-requests/useQuizActions'

interface IProps {
    userCreatorId: string,
    quizId: string
}

export default function CardActions({userCreatorId, quizId} : IProps) {
    const { user, setUserAccess} = useUser(),
        token = getCookie('token'),
        {saveQuiz, unsaveQuiz, verifySave} = useQuizActions(user?.savedQuizzes)

    const handleSave = ()=>{
        if (verifySave(quizId)) return
        saveQuiz(quizId, `${token}`).then(res=>{
            setUserAccess(res.token)
        })
    },
    handleUnsave = ()=>{
        if (!verifySave(quizId)) return
        unsaveQuiz(quizId, `${token}`).then(res=>{
            setUserAccess(res.token)
        })
    }

    return (
        <nav className={`${styles.navQuizHover} `}>
            <ul>
                <li><Link href={`/quiz/${quizId}`}>
                    Quiz Page
                </Link></li>
                <li><Link href={`/quiz/${quizId}/taking`}>
                    Take The Quiz
                </Link></li>
                <li>
                    {verifySave(quizId) && <button onClick={handleUnsave}>Remove</button>}
                    {!verifySave(quizId) && <button onClick={handleSave}>Save</button>}
                </li>
                {user?.userId === userCreatorId && <li><Link href={`/quiz/${quizId}/editing`}>
                    Edit Quiz
                </Link></li>}
            </ul>
        </nav>
    )
}
