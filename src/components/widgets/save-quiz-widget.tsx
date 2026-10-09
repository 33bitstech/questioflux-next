'use client'
import { useUser } from '@/contexts/userContext'
import useQuizActions from '@/hooks/requests/quiz-requests/useQuizActions'
import React from 'react'
import { useTranslations } from 'next-intl'
import { trackEvent } from '@/utils/analytics'

interface IProps {
    quizId: string
}

export default function SaveQuizWidget({ quizId }: IProps) {
    const t = useTranslations('quizActions.saveWidget')
    const { user, fetchUser } = useUser()
    const { saveQuiz, unsaveQuiz, verifySave } = useQuizActions(user?.savedQuizzes)

    const handleSave = async () => {
        if (verifySave(quizId)) return
        const saved = await saveQuiz(quizId)
        if (saved) trackEvent('quiz_save', { quiz_id: quizId })
        await fetchUser()
    }

    const handleUnsave = async () => {
        if (!verifySave(quizId)) return
        const removed = await unsaveQuiz(quizId)
        if (removed) trackEvent('quiz_unsave', { quiz_id: quizId })
        await fetchUser()
    }

    return (
        <>
            {verifySave(quizId) && <button onClick={handleUnsave}>{t('remove')}</button>}
            {!verifySave(quizId) && <button onClick={handleSave}>{t('save')}</button>}
        </>
    )
}