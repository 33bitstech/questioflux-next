'use client'
import IUserLeaderBoardScore from '@/interfaces/IUserLeaderBoardScore'
import React from 'react'
import CloseSvg from '../Icons/CloseSvg'
import styles from './user-answers.module.scss'
import IQuizes from '@/interfaces/IQuizes'
import { useTranslations } from 'next-intl' // Importar

interface IProps{
    userLb: IUserLeaderBoardScore
    quiz: IQuizes,
    closeAnswers: ()=>void
}

export default function UserAnswers({userLb, closeAnswers, quiz}:IProps) {
    const t = useTranslations('leaderboardPage.userAnswers'); // Inicializar hook
    const results = userLb.result;

    return (
        <div className={`${styles.results_container}`}>
            <div className={styles.close_container} onClick={closeAnswers}>
                <span><CloseSvg/></span>
            </div>
            <div className={styles.user_info}>
                <h2>{userLb.name}</h2>
                {/* Usar a tradução */}
                <p>{t('attempts')} <span>{userLb.attempts || '1'}</span></p>
            </div>
            <div className={styles.correct_container}>
                <h2>{t('correctTitle')}</h2>
                <div className={styles.divs_container}>
                    <div className={styles.for_overflow}>
                        {results.correctAnswers?.map((res, i)=>(<div key={i} className={styles.datas_container}>
                            <span>{i+1}</span>
                            <h3>{t('questionLabel')} <span>{res.question}</span></h3>
                            {quiz.type !== 'image/RW' && <p>{t('answerLabel')} <span>{res.answer}</span></p> }
                        </div>))}
                    </div>
                </div>
            </div>
            <span className={styles.bar}></span>
            <div className={styles.incorrect_container}>
                <h2>{t('incorrectTitle')}</h2>
                <div className={styles.divs_container}>
                    {results.incorrectAnswers?.map((res, i)=>(<div key={i} className={styles.datas_container}>
                        <span>{i+1}</span>
                        <h3>{t('questionLabel')} <span>{res.question}</span></h3>
                        {quiz.type !== 'image/RW' && <p>{t('answerLabel')} <span>{res.answer}</span></p> }
                    </div>))}
                </div>
            </div>
        </div>
    )
}