import ContextualHeaderActions from '@/components/NavigateWidgets/contextual-header-action'
import UserProfileHeader from '@/components/User/user-profile-header'
import React from 'react'

import styles from '../../home/home.module.scss'
import ContainerUserQuizzes from '@/components/User/quiz/container-user-quizzes'
import { env } from '@/env'
import { IUser } from '@/interfaces/IUser'
import { getTranslations } from 'next-intl/server'

interface IProps{
    params:Promise<{
        userId: string,
        locale:string
    }>
}

async function getUser(userId:string) : Promise<IUser | undefined>{
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/user/${userId}`, {
            method: 'GET',
        });

        const res = await response.json();
        return res;
    } catch (err) {
        console.log(err)
    }   
}

export default async function User({params}:IProps) {
    const {userId, locale} = await params,
        user = await getUser(userId),
        t = await getTranslations({ locale, namespace: 'publicProfile' });
    return (
        <>
            <main className={styles.content}>
                <UserProfileHeader userP={user} />

                <nav className={styles.div_buttons_links}>
                    <ContextualHeaderActions page='home' locale={locale}/>
                </nav>

                <div className={styles.quiz_area}>
                    <ContainerUserQuizzes
                        styles={styles}
                        quizzes_type='public'
                        customTitle={t('customTitle')}
                        userP={user}
                    />
                </div>

            </main>
        </>
    )
}
