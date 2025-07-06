'use client'

import React from 'react'
import NavLink from '../widgets/NavLink'
import styles from './nav-creating-quiz.module.scss'
import { useTranslations } from 'next-intl'

interface IProps{
    isBlock?: boolean
    quizId?: string
    isBacking?: boolean
    locale: string
}
                
export default function NavCreatinQuiz({isBlock, quizId, isBacking, locale}: IProps) {
    const t = useTranslations('creatingQuiz.nav' );

    return (
        <nav className={styles.navQuiz}>
            <ul>
                <li>
                    <NavLink 
                        href={!isBacking ? '/create/quiz/cover' : `/quiz/edit/${quizId}`} 
                        className={styles.link}  
                        styles={styles}
                    >
                        {/* Usar as traduções */}
                        {t('cover')} {'>'}
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        href={`/create/quiz/questions/${quizId}`} 
                        className={styles.link}  
                        isBlock={isBlock}
                        styles={styles}
                    >
                        {t('questions')} {'>'}
                    </NavLink>
                </li>
            </ul>
        </nav>
    )
}