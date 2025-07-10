import { env } from '@/env';
import styles from './leaderboard.module.scss'
import LbUser from '@/components/Leaderboard/lb-user';
import ShareButton from '@/components/widgets/share-button';
import { TLeaderboard } from '@/types/leaderboardTypes';
import IQuizes from '@/interfaces/IQuizes';
import { IUser } from '@/interfaces/IUser';
import {CookieValueTypes, getCookie} from 'cookies-next/server'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import GoogleAd from '@/components/Google/GoogleAd';

interface IProps {
    params: Promise<{
        quizId: string,
        locale:string
    }>
}
export async function generateMetadata({ params}: IProps): Promise<Metadata> {
    const {quizId, locale} = await params
    const t = await getTranslations({ locale, namespace: 'leaderboardPage.metadata' });
    const quiz = await getQuiz(quizId)

    const langs = {
        'en-US': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/quiz/${quizId}/leaderboard`,
        'pt-BR': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/pt/quiz/${quizId}/leaderboard`,
        'x-default': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/quiz/${quizId}/leaderboard`
    },
    names = {
        quiz_name: quiz?.title ?? ''
    }

    return {
        title: t('title', names),
        description: t('desc', names),
        robots: 'index, follow',
        keywords: "quiz, ranking, leaderboard, lb, users, answers",
        alternates:{
            canonical: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/quiz/${quizId}/leaderboard`,
            languages: langs
        },
        openGraph: {
            title: t('title', names),
            description: t('desc', names),
            url: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/quiz/${quizId}/leaderboard`, 
            siteName: 'Quiz Vortex',
            images: quiz?.quizThumbnail ?? `${env.NEXT_PUBLIC_DOMAIN_FRONT}/trofeu.png`,
        },
        twitter: {
            title: t('title', names),
            description: t('desc', names),
            images: [quiz?.quizThumbnail ?? `${env.NEXT_PUBLIC_DOMAIN_FRONT}/trofeu.png`],
        }
    }
}

export async function getQuiz(quizId:string) : Promise<IQuizes|undefined> {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/${quizId}`, {
            method: 'GET',
        });

        const res = await response.json();
        return res.quiz;

    } catch (err: any) {
        console.log(err)
    }
}
export async function getLeaderboard(quizId:string) : Promise<TLeaderboard | undefined> {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/leaderboard/${quizId}`, {
            method: 'GET',
        });

        const res = await response.json();
        return res.scoreBoard;

    } catch (err: any) {
        console.log(err)
    }
}
export async function getUser(token:CookieValueTypes) : Promise<IUser | undefined>{
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/user`, {
            method: 'GET',
            headers:{
                'Authorization': `${token}`
            }
        });

        const res = await response.json();
        return res.user;
    } catch (err) {
        console.log(err)
    }   
}

export default async function Leaderboard({params}:IProps) {
    const {quizId, locale} = await params,
        token = await getCookie('token', {cookies}),
        t = await getTranslations({ locale, namespace: 'leaderboardPage' }),

        [quizLb, quiz, user] = await Promise.all([
            getLeaderboard(quizId),
            getQuiz(quizId),
            getUser(token)
        ]),
        
        userInLeaderboard = quizLb?.find(lbUser => lbUser.userId === user?.userId),
        userPosition = (quizLb && userInLeaderboard) ? quizLb.indexOf(userInLeaderboard) : 999


    const leaderboardSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": t('metadata.schemaName', {quiz_name: quiz?.title ?? ''}),
        "itemListOrder": "https://schema.org/ItemListOrderDescending",
        "itemListElement": quizLb?.map((player, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Person",
                "name": player.name,
                "url": `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/user/${player.userId}`
            }
        }))
    }
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(leaderboardSchema) }}
            />
            {!quizLb && (
                <p>{t('noResults')}</p>
            )}
            <div className={styles.leaderboard_container}>
                {quiz && quizLb && quizLb.slice(0,10).map((userLb, index)=>(
                    <div className={styles.user_results} key={index}>
                        <LbUser 
                            locale={locale}
                            index={index} 
                            styles={styles} 
                            userLb={userLb}
                            quiz={quiz}
                            quizLb={quizLb}
                        />
                    </div>
                ))}
                {quiz && quizLb && userInLeaderboard && userPosition >= 10 && (
                        <div className={styles.user_results}>
                            <LbUser
                                locale={locale}
                                index={userPosition}
                                styles={styles}
                                userLb={userInLeaderboard}
                                quiz={quiz}
                                quizLb={quizLb}
                            />
                        </div>
                    )}
            </div>
            
            <ShareButton quizId={quizId} styles={styles}/>

            <GoogleAd/>
        </>
    )
}
