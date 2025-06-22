'use client'
import React from 'react'

import styles from './card-actions.module.scss'
import Link from 'next/link'
import { useUser } from '@/contexts/userContext'
import SaveQuizWidget from '@/components/widgets/save-quiz-widget'
import LinkEdit from './link-edit'

interface IProps {
    userCreatorId: string,
    quizId: string
}

export default function CardActions({userCreatorId, quizId} : IProps) {
    const { user} = useUser()

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
                    <SaveQuizWidget quizId={quizId} />
                </li>
                <LinkEdit quizId={quizId} userCreatorId={userCreatorId}/>
            </ul>
        </nav>
    )
}
