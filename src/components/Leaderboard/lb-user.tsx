import { IUser } from '@/interfaces/IUser'
import { TStyles } from '@/types/stylesType'
import {Link} from '@/i18n/navigation'
import React from 'react'
import UserProfileImgRender from '../ImagesRender/user-profile-img-render'
import LeaderboardTop from '../Icons/Badges/LeaderboardTop'
import IUserLeaderBoardScore from '@/interfaces/IUserLeaderBoardScore'
import { getTimeString } from '@/utils/FormatTime'
import HandleAnswers from './handle-answers'
import IQuizes from '@/interfaces/IQuizes'
import { TLeaderboard } from '@/types/leaderboardTypes'

interface IProps{
    styles: TStyles,
    userLb: IUserLeaderBoardScore,
    index: number,
    quiz: IQuizes,
    quizLb: TLeaderboard
    locale:string
}

export default function LbUser({styles, userLb, index, quiz, quizLb, locale}: IProps) {
    return (
        <>
            <div className={styles.user}>
                <div className={styles.user_images}>
                    <div className={styles.rank}>
                        {index <= 2 ? <LeaderboardTop position={index}/> : <span>{index > 9 ? '+' : ''}{index+1}</span>}
                    </div>
                    <div className={styles.profileImg}>
                        <UserProfileImgRender user={userLb} />
                    </div>
                </div>
                <Link locale={locale} href={`/user/${userLb.userId}`}>{userLb.name}</Link>
            </div>
            <div className={styles.result}>
                <HandleAnswers 
                    quiz={quiz} 
                    quizLb={quizLb}  
                    styles={styles} 
                    userLb={userLb}
                />
                <span className={styles.time}>{getTimeString(userLb.timing)}</span>
            </div>
        </>
    )
}
