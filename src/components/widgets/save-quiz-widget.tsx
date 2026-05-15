'use client'
import { useUser } from '@/contexts/userContext'
import useQuizActions from '@/hooks/requests/quiz-requests/useQuizActions'
import React from 'react'
import { useTranslations } from 'next-intl'

interface IProps {
    quizId: string
}

export default function SaveQuizWidget({ quizId }: IProps) {
    const t = useTranslations('quizActions.saveWidget')
    const { user, fetchUser } = useUser()
    const { saveQuiz, unsaveQuiz, verifySave } = useQuizActions(user?.savedQuizzes)

    const handleSave = async () => {
        if (verifySave(quizId)) return
        await saveQuiz(quizId)
        await fetchUser()
    }

    const handleUnsave = async () => {
        if (!verifySave(quizId)) return
        await unsaveQuiz(quizId)
        await fetchUser()
    }

    return (
        <>
            {verifySave(quizId) && <button onClick={handleUnsave}>{t('remove')}</button>}
            {!verifySave(quizId) && <button onClick={handleSave}>{t('save')}</button>}
        </>
    )
}