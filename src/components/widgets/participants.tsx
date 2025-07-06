'use client'
import IQuizes from '@/interfaces/IQuizes'
import { IUser } from '@/interfaces/IUser'
import IUserLeaderBoardScore from '@/interfaces/IUserLeaderBoardScore'
import { TStyles } from '@/types/stylesType'
import React, { useEffect, useState } from 'react'
import ParticipantsContainer from './participants-container'
import useQuizDatas from '@/hooks/requests/quiz-requests/useQuizDatas'
import { TLeaderboard } from '@/types/leaderboardTypes'
import { useLocale, useTranslations } from 'next-intl'

interface IProps{
    styles: TStyles,
    quiz: IQuizes
}

export default function Participants({quiz, styles}: IProps) {
    const [showParticipants, setShowParticipants] = useState<boolean>(false),
        [participants, setParticipants] = useState<TLeaderboard>(),
        {getLeaderboard} = useQuizDatas(),
        t = useTranslations('quizInfoPage'),
        locale = useLocale()

    useEffect(()=>{
        const get = async ()=>{
            try {
                const res = await getLeaderboard(quiz.quizId)
                if(res) {
                    setParticipants(res.scoreBoard)
                }
            } catch (err) {
                
            }
        }
        get()
    },[])

    return (
        <>
            <span onClick={()=>setShowParticipants(value=>!value)} className={styles.participants}>{quiz.usersCount} {t('details.participantsSpan')}</span>

            {showParticipants && participants && 
                <div className={styles.participants_popup}>
                    <ParticipantsContainer 
                        users={participants} 
                        locale={locale}
                        closeParticipants={()=>setShowParticipants(false)}
                    />
                    
                </div>
            }

            {showParticipants && participants && 
                <div onClick={()=>{setShowParticipants(false)}} className={styles.overlay_participants}></div>
            }
        </>
    )
}
