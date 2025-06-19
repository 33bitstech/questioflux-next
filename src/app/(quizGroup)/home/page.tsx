import ContextualHeaderActions from '@/components/NavigateWidgets/contextual-header-action'
import UserProfileHeader from '@/components/User/user-profile-header'
import React from 'react'

import styles from './home.module.scss'

export default function Home() {
    return (
        <>
            <main className={styles.content}>
                <UserProfileHeader />

                <nav className={styles.div_buttons_links}>
                    <ContextualHeaderActions page='home'/>
                </nav>

                <div className={styles.quiz_area}>
                    <h2>My private quizzes (0)</h2>
                </div>
                <div className={styles.quiz_area}>
                    <h2>My public quizzes (0)</h2>
                </div>

            </main>
        </>
    )
}
