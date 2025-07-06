'use client'
import { useUser } from '@/contexts/userContext'
import {Link} from '@/i18n/navigation'
import React from 'react'
import { useTranslations } from 'next-intl' // Importar

interface IProps{
    quizId: string,
    userCreatorId: string
}

export default function LinkEdit({quizId, userCreatorId}: IProps) {
    const { user} = useUser()
    const t = useTranslations('quizCard.actions');

    if(user?.userId !== userCreatorId) return null

    return (
        <li><Link href={`/quiz/edit/${quizId}`}>
            {t('editQuiz')}
        </Link></li>
    )
}