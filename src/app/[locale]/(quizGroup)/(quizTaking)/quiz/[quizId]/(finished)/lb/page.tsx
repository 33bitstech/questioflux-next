import ShareButton from '@/components/widgets/share-button'
import React from 'react'
import styles from '../../../../../(quizPage)/quiz/[quizId]/leaderboard/leaderboard.module.scss'
import { getCookie } from 'cookies-next/server'
import { cookies } from 'next/headers'
import { getLeaderboard, getQuiz, getUser } from '@/app/[locale]/(quizGroup)/(quizPage)/quiz/[quizId]/leaderboard/page'
import LbUser from '@/components/Leaderboard/lb-user'

interface IProps {
    params: {
        quizId: string
    }
}

export default async function LB({params}:IProps) {
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
