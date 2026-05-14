import React from 'react'
import styles from '../layout.module.scss'
import ContainerUserQuizzes from '@/components/User/quiz/container-user-quizzes'
import DeleteContainer from '@/components/EditingQuiz/multipleDelete/delete-container'
import { getCookieHeader } from '@/utils/getCookieHeader'
import { env } from '@/env'

async function getDrafts(cookieHeader: string) {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quizzes/drafts`, {
            method: 'GET',
            headers: { 'cookie': cookieHeader },
            cache: 'no-store',
        });
        const { quizzes } = await response.json();
        return quizzes
    } catch (err) {
        console.log(err)
    }
}

export default async function Drafts() {
    const cookieHeader = await getCookieHeader()
    const drafts = await getDrafts(cookieHeader)

    return (
        <>
            <div className={styles.saves_drafts}>
                <ContainerUserQuizzes quizzes_type='draft' styles={styles} defaultQuizzes={drafts} />
            </div>
            <DeleteContainer quizzes={drafts} />
        </>
    )
}