import ContextualHeaderActions from '@/components/NavigateWidgets/contextual-header-action'
import UserProfileHeader from '@/components/User/user-profile-header'
import React from 'react'

import styles from '../../home/home.module.scss'
import ContainerUserQuizzes from '@/components/User/quiz/container-user-quizzes'
import { env } from '@/env'
import { IUser } from '@/interfaces/IUser'
import { getTranslations } from 'next-intl/server'
import GoogleAd from '@/components/Google/GoogleAd'
import { Metadata } from 'next'
import IQuizes from '@/interfaces/IQuizes'
import { publicQuizzes } from '../action'

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

export async function generateMetadata({ params}: IProps): Promise<Metadata> {
    const {userId, locale} = await params
    const t = await getTranslations({ locale, namespace: 'publicProfile.metadata' });
    const user = await getUser(userId)

    const langs = {
        'en-US': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/user/${userId}`,
        'pt-BR': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/pt/user/${userId}`,
        'x-default': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/user/${userId}`
    },
    names = {
        name_user: user?.name ?? ''
    }

    return {
        title: t('title', names),
        description: t('desc', names),
        robots: 'index, follow',
        keywords: "quiz, profile, public",
        alternates:{
            canonical: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/user/${userId}`,
            languages: langs
        },
        openGraph: {
            title: t('title', names),
            description: t('desc', names),
            url: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/user/${userId}`, 
            siteName: 'Quiz Vortex',
            images: user?.profileImg != 'default' && user?.profileImg ? user?.profileImg : `${env.NEXT_PUBLIC_DOMAIN_FRONT}/quiz_padrao_preto.png`,
        },
        twitter: {
            title: t('title', names),
            description: t('desc', names),
            images: [
                user?.profileImg && user?.profileImg !== 'default' && user?.profileImg
                    ? user.profileImg
                    : `${env.NEXT_PUBLIC_DOMAIN_FRONT}/quiz_padrao_preto.png`
            ],
        }
    }
}

export default async function User({params}:IProps) {
    const {userId, locale} = await params,
        user = await getUser(userId),
        t = await getTranslations({ locale, namespace: 'publicProfile' });

        const quizzes = await publicQuizzes(userId)

    const createdQuizzes = {
        "@type": "ItemList",
        "name": t('metadata.createdQuizzesName', {name_user: user?.name ?? ''}),
        "itemListElement": quizzes?.map((quiz, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": quiz.title,
            "url": `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/quiz/${quiz.quizId}`
        }))
    },
    userScheme = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "mainEntity": {
            "@type": "Person",
            "@id": `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/user/${user?.userId}#person`,
            "name": user?.name,
            "email": user?.email,
            "mainEntityOfPage": `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/user/${user?.userId}`,
            "finished_quizzes": user?.finishedQuizzes?.length // pro paulo coisa dps
        },
        "hasPart": createdQuizzes
    }
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(userScheme) }}
            />
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
                        canGetPublic={true}
                        defaultQuizzes={quizzes}
                    />
                </div>

                <GoogleAd/>

            </main>
        </>
    )
}
