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
import { publicQuizzes } from '../action'
import { notFound } from 'next/navigation'

interface IProps{
    params:Promise<{
        userId: string,
        locale:string
    }>
}

async function getUser(userId: string): Promise<IUser | undefined> {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/user/${userId}`, {
            method: 'GET',
        })

        if (!response.ok) return undefined

        const res = await response.json()

        if (!res?.userId) return undefined

        return res
    } catch (err) {
        console.log(err)
        return undefined
    }
}

export async function generateMetadata({ params}: IProps): Promise<Metadata> {
    const {userId, locale} = await params
    const t = await getTranslations({ locale, namespace: 'publicProfile.metadata' });
    const user = await getUser(userId)

    if (!user) {
        return {
            title: 'User not found',
            robots: 'noindex, nofollow',
        }
    }

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
            siteName: 'QuestioFlux',
            images: user?.profileImg != 'default' && user?.profileImg ? user?.profileImg : `${env.NEXT_PUBLIC_DOMAIN_FRONT}/quiz_padrao_preto.png`,
            type: 'website'
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

const formatMemberSince = (date: Date | undefined, locale: string) => {
    if (!date) return null
    return new Intl.DateTimeFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
        month: 'long',
        year: 'numeric',
    }).format(new Date(date))
}

export default async function User({params}:IProps) {
    const {userId, locale} = await params

    const [user, t, quizzes] = await Promise.all([
        getUser(userId),
        getTranslations({ locale, namespace: 'publicProfile' }),
        publicQuizzes(userId)
    ])

    if (!user) notFound()

    const memberSince = formatMemberSince(user.created_at, locale)
    const quizzesCount = quizzes?.length ?? 0

    const completedCount = new Set(
        (user.finishedQuizzes ?? [])
            .map((finishedQuiz) => finishedQuiz.quizId)
            .filter((quizId): quizId is string => Boolean(quizId))
    ).size

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
            "mainEntityOfPage": `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/user/${user?.userId}`,
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

                {/* Stats bar — enriquece o conteúdo da página */}
                <div style={{
                    display: 'flex',
                    gap: '2rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '0.9375rem',
                    boxShadow: '0px 0px 7px 0px rgba(0,0,0,0.10)',
                    backgroundColor: 'var(--background-primary)',
                }}>
                    <div style={{ textAlign: 'center', alignItems:'center'}}>
                        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{quizzesCount}</p>
                        <p style={{ fontSize: '.8rem', color: 'var(--text-description)' }}>
                            {locale === 'pt' ? 'Quizzes criados' : 'Quizzes created'}
                        </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{completedCount}</p>
                        <p style={{ fontSize: '.8rem', color: 'var(--text-description)' }}>
                            {locale === 'pt' ? 'Quizzes jogados' : 'Quizzes played'}
                        </p>
                    </div>
                    {memberSince && (
                        <div style={{ textAlign: 'center', display:'flex', flexDirection:'column', justifyContent:'space-around' }}>
                            <p style={{ textTransform:'capitalize',fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{memberSince}</p>
                            <p style={{ fontSize: '.8rem', color: 'var(--text-description)' }}>
                                {locale === 'pt' ? 'Membro desde' : 'Member since'}
                            </p>
                        </div>
                    )}
                </div>

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

                <GoogleAd slot='5678559785'/>
            </main>
        </>
    )
}