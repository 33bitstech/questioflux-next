'use client'
import { useUser } from '@/contexts/userContext'
import Link from 'next/link'
import React from 'react'

interface IProps{
    quizId: string,
    userCreatorId: string
}

export default function LinkEdit({quizId, userCreatorId}: IProps) {
    const { user} = useUser()

    if(user?.userId !== userCreatorId) return null

    return (
        <li><Link href={`/quiz/edit/${quizId}`}>
            Edit Quiz
        </Link></li>
    )
}
