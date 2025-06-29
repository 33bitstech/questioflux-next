import React from 'react'
import NavLink from '../widgets/NavLink'
import { TStyles } from '@/types/stylesType'

interface IProps{
    isBlock?: boolean
    quizId?: string
    styles: TStyles
}
                    
export default function NavCreatinQuiz({isBlock, quizId, styles}: IProps) {
    return (
        <nav className={styles.navQuiz}>
            <ul>
                <li>
                    <NavLink 
                        href={'/create/quiz/cover'} 
                        className={styles.link}  
                        styles={styles}
                    >
                        Quiz Cover {'>'}
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        href={`/create/quiz/questions/${quizId}`} 
                        className={styles.link}  
                        isBlock={isBlock}
                        styles={styles}
                    >
                        Questions {'>'}
                    </NavLink>
                </li>
            </ul>
        </nav>
    )
}
