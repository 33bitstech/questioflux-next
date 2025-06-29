import React from 'react'
import NavLink from '../widgets/NavLink'
import styles from './nav-creating-quiz.module.scss'

interface IProps{
    isBlock?: boolean
    quizId?: string
    isBacking?: boolean
}
                    
export default function NavCreatinQuiz({isBlock, quizId, isBacking}: IProps) {
    return (
        <nav className={styles.navQuiz}>
            <ul>
                <li>
                    <NavLink 
                        href={!isBacking ? '/create/quiz/cover' : `/quiz/edit/${quizId}`} 
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
