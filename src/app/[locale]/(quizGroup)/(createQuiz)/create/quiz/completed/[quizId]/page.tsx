import React from 'react'

import styles from './completed.module.scss'
import ShareContainer from '@/components/widgets/share-container'
import {Link} from '@/i18n/navigation'

interface IProps {
    params:{
        quizId: string
    }
}

export default async function CompletedPage({params} : IProps) {
    const {quizId} = await params

    return (
        <main className={styles.content}>
            <h2>Congratulations! Your quiz has been created successfully!</h2>
            <div className={styles.share}>
                <ShareContainer
                    quizId={quizId}
                />
            </div>
            <nav className={styles.navigation_created}>
                <Link href={`/quiz/${quizId}`}>View Quiz</Link>
                <Link href={`/home`}>Home</Link>
            </nav>
        </main>
    )
}