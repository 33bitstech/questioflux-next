import { env } from '@/env';
import styles from './leaderboard.module.scss'
import LbUser from '@/components/Leaderboard/lb-user';
import ShareButton from '@/components/widgets/share-button';
import { TLeaderboard } from '@/types/leaderboardTypes';
import IQuizes from '@/interfaces/IQuizes';
import { IUser } from '@/interfaces/IUser';
import {CookieValueTypes, getCookie} from 'cookies-next/server'
import { cookies } from 'next/headers'

interface IProps {
    params: {
        quizId: string
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
    const {quizId} = await params,
        token = await getCookie('token', {cookies}),

        [quizLb, quiz, user] = await Promise.all([
            getLeaderboard(quizId),
            getQuiz(quizId),
            getUser(token)
        ]),
        
        userInLeaderboard = quizLb?.find(lbUser => lbUser.userId === user?.userId),
        userPosition = (quizLb && userInLeaderboard) ? quizLb.indexOf(userInLeaderboard) : 999

    return (
        <>
            {!quizLb && (
                <p>No one answered this quiz</p>
            )}
            <div className={styles.leaderboard_container}>
                {quiz && quizLb && quizLb.slice(0,10).map((userLb, index)=>(
                    <div className={styles.user_results} key={index}>
                        <LbUser 
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
        </>
    )
}
