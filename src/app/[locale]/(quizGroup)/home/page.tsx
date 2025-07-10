import ContextualHeaderActions from '@/components/NavigateWidgets/contextual-header-action'
import UserProfileHeader from '@/components/User/user-profile-header'
import React from 'react'

import styles from './home.module.scss'
import ContainerUserQuizzes from '@/components/User/quiz/container-user-quizzes'
import Skeleton from '@/components/Loading/skeleton'
import LoadingReq from '@/components/Loading/loading-req'
import GoogleAd from '@/components/Google/GoogleAd'

interface IProps{
    params: Promise<{
        locale:string
    }>
}

export default async function Home({params}:IProps) {
    const {locale} = await params
    return (
        <>
            <main className={styles.content}>
                <UserProfileHeader />

                <nav className={styles.div_buttons_links}>
                    <ContextualHeaderActions page='home' locale={locale}/>
                </nav>

                <div className={styles.quiz_area}>
                    <ContainerUserQuizzes
                        styles={styles}
                        quizzes_type='private'
                    />
                </div>

                <GoogleAd/>
                
                <div className={styles.quiz_area}>
                    <ContainerUserQuizzes
                        styles={styles}
                        quizzes_type='public'
                    />
                </div>
                <GoogleAd/>
            </main>
        </>
    )
}
