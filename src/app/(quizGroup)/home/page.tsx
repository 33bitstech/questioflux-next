import ContextualHeaderActions from '@/components/NavigateWidgets/contextual-header-action'
import UserProfileHeader from '@/components/User/user-profile-header'
import React from 'react'

import styles from './home.module.scss'
import ContainerUserQuizzes from '@/components/User/quiz/container-user-quizzes'

export default function Home() {
    return (
        <>
            <main className={styles.content}>
                <UserProfileHeader />

                <nav className={styles.div_buttons_links}>
                    <ContextualHeaderActions page='home'/>
                </nav>

                <div className={styles.quiz_area}>
                    <ContainerUserQuizzes
                        styles={styles}
                        quizzes_type='private'
                    />
                </div>
                
                <div className={styles.quiz_area}>
                    <ContainerUserQuizzes
                        styles={styles}
                        quizzes_type='public'
                    />
                </div>

            </main>
        </>
    )
}
