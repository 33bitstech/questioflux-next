import React from 'react'
import styles from '../layout.module.scss'
import ContainerUserQuizzes from '@/components/User/quiz/container-user-quizzes'

export default function Drafts() {
    return (
        <div className={styles.saves_drafts}>
            <ContainerUserQuizzes quizzes_type='draft' styles={styles}/>
        </div>
    )
}
