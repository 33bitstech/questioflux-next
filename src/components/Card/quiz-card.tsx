'use client'
import IQuizes from '@/interfaces/IQuizes'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
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
    const [isMobileMenuActive, setIsMobileMenuActive] = useState(false);
    const {resolvedTheme} = useTheme();

    // largura da tela e tema só existem no navegador: até montar, o card sai como no HTML do
    // servidor (versão de desktop, imagem padrão clara); senão a hidratação não bate e o React
    // mantém a classe e a imagem erradas
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true)
    }, [])
    const matchesMobile = useMediaQuery({ maxWidth: 860 });
    const isMobile = mounted && matchesMobile;
    const dark = mounted && resolvedTheme === 'dark';
    const mobileActiveClass = isMobile && isMobileMenuActive ? styles.mobile_active : '';

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
            {/* h3: o título da página (h1) e o da seção (h2) vêm antes dos cards */}
            <div className={styles.title_area}>
                <h3>{quiz.title}</h3>
                <p>{quiz.description}</p>
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
                                : dark
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