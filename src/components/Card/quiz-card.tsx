'use client'
import IQuizes from '@/interfaces/IQuizes'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import React, { useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import styles from './quiz-card.module.scss'
import CardActions from './hover/card-actions'
import { useTranslations } from 'next-intl' // Importar
import Skeleton from '../Loading/skeleton'

interface IProps{
    quiz: IQuizes
}

export default function QuizCard({quiz}: IProps) {
    const t = useTranslations('quizCard'); // Inicializar hook
    const [imageLoading, setImageLoading] = useState(true);
    const [imageBackup, setImageBackup] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 860 });
    const [isMobileMenuActive, setIsMobileMenuActive] = useState(false);
    const mobileActiveClass = isMobile && isMobileMenuActive ? styles.mobile_active : '';
    const {theme} = useTheme();

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
                        <div className={styles.skeleton_wrapper}>
                            <Skeleton />
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
                        className={imageLoading ? styles.image_loading : styles.image_loaded}
                        alt={quiz.description} 
                        onLoad={() => setImageLoading(false)}
                        onError={() => {
                            setImageLoading(false);
                            setImageBackup(true);
                        }}
                        fetchPriority='high'
                        loading='lazy'
                    />
                    <div className={styles.footerImg}>
                        <div>
                            <p>{quiz.idiom}</p>
                        </div>
                        <div>
                            <p>
                                {t('createdBy')}
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