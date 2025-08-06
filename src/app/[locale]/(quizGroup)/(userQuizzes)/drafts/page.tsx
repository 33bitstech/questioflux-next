import React from 'react'
import styles from '../layout.module.scss'
import ContainerUserQuizzes from '@/components/User/quiz/container-user-quizzes'
import DeleteContainer from '@/components/EditingQuiz/multipleDelete/delete-container'
import {getCookie} from 'cookies-next/server'
import { cookies } from 'next/headers'
import { env } from '@/env'

async function getDrafts (token: string) {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quizzes/drafts`, {
            method: 'GET',
            headers: {
                'Authorization': token,
            },
            cache: 'no-store'
        });

        const {quizzes} = await response.json();
        return quizzes
    } catch (err) {
        console.log(err)
    }
}

export default async function Drafts() {
    const token = await getCookie('token', {cookies})
    const drafts = await getDrafts(String(token))

    return (
        <>
            <div className={styles.saves_drafts}>
                <ContainerUserQuizzes quizzes_type='draft' styles={styles} defaultQuizzes={drafts} />
            </div>

            <DeleteContainer quizzes={drafts}/>
        </>
    )
}
