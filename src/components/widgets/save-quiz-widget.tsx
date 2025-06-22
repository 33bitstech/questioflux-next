'use client'
import { useUser } from '@/contexts/userContext'
import useQuizActions from '@/hooks/requests/quiz-requests/useQuizActions'
import { getCookie } from 'cookies-next/client'
import React from 'react'

interface IProps {
    quizId: string
}

export default function SaveQuizWidget({quizId}: IProps) {
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
        <>
            {verifySave(quizId) && <button onClick={handleUnsave}>Remove</button>}
            {!verifySave(quizId) && <button onClick={handleSave}>Save</button>}
        </>
    )
}
