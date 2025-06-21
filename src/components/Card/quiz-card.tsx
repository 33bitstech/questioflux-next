'use client'
import IQuizes from '@/interfaces/IQuizes'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import React, { useState } from 'react'
import { useMediaQuery } from 'react-responsive'

import styles from './quiz-card.module.scss'
import CardActions from './hover/card-actions'

interface IProps{
    quiz: IQuizes
}

export default function QuizCard({quiz}: IProps) {
    const [imageLoading, setImageLoading] = useState(true),
        [imageBackup, setImageBackup] = useState(false),

        isMobile = useMediaQuery({ maxWidth: 860 }),
        [isMobileMenuActive, setIsMobileMenuActive] = useState(false),

        mobileActiveClass = isMobile && isMobileMenuActive ? styles.mobile_active : '',

        {theme} = useTheme()

    const handleContainerClick = () => {
        if (isMobile) {
            setIsMobileMenuActive(prevState => !prevState); 
        }
    }

    return (
        <article
            className={`${styles.quiz_container} ${isMobile ? styles.mobile_version : styles.desktop_version} ${mobileActiveClass}`}
            onClick={handleContainerClick} 
        >
            <div className={styles.title_area}>
                <h1>{quiz.title}</h1>
                <h2>{quiz.description}</h2>
            </div>
            <div className={styles.container_transition_hover}>
                <div className={styles.img_container}>
                    {imageLoading && (
                        <div className={styles.img_loading}>
                            {/* <LoadingComp /> */}
                            <p>carregando...</p>
                        </div>
                    )}
                    
                    <Image 
                        src={
                            quiz.quizThumbnail !== 'default' && !imageBackup
                                ? quiz.quizThumbnail
                                : theme === 'dark'
                                ? '/quiz_padrao_preto.png'
                                : '/quiz_padrao_branco.png'
                        }
                        width={400}
                        height={400}
                        alt={quiz.description}
                        onLoad={() => setImageLoading(false)}
                        onError={() => {
                            setImageLoading(false);
                            setImageBackup(true);
                        }}
                    />
                    <div className={styles.footerImg}>
                        <div>
                            <p>{quiz.idiom}</p>
                        </div>
                        <div>
                            <p>
                                Created by
                                <span className={styles.container_span}>
                                    <span> @{quiz.userCreatorName}</span>
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className={styles.gradient_container}>
                        <CardActions
                            userCreatorId={quiz?.userCreatorId}
                            quizId={quiz.quizId}
                        />
                    </div>
                </div>
            </div>
        </article>
    )
}
