'use client'

import React from 'react'
import NavLink from '../widgets/NavLink'
import styles from './nav-creating-quiz.module.scss'
import { useTranslations } from 'next-intl'
import { QuizKind } from '@/utils/quizKind'

interface IProps{
    isBlock?: boolean
    quizId?: string
    isBacking?: boolean
    locale: string
    // o segundo passo leva o nome do conteúdo: opções no torneio, cenas na história
    kind?: QuizKind
}

export default function NavCreatinQuiz({isBlock, quizId, isBacking, locale, kind}: IProps) {
    const t = useTranslations('creatingQuiz.nav' );
    const contentLabel = kind === 'tournament' ? t('options') : kind === 'story' ? t('scenes') : t('questions')

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
                        {contentLabel} {'>'}
                    </NavLink>
                </li>
            </ul>
        </nav>
    )
}