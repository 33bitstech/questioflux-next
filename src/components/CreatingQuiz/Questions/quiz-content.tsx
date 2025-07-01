'use client'

import ToggleQuizMode from '@/components/widgets/toggle-quiz-mode'
import { TStyles } from '@/types/stylesType'
import React, { useState } from 'react'
import FormCreateQuestions from './form-create-questions'
import NavCreatinQuiz from '../nav-creating-quiz'

interface IProps{
    styles: TStyles
    quizId: string
}

export default function QuizContent({styles, quizId}:IProps) {
    const [textMode, setTextMode] = useState<boolean>(true)
    return (
        <>
            <div className={styles.subtitle_questions}>
                <NavCreatinQuiz
                    quizId={quizId}
                    isBacking={true}
                />
                <p>
                    Appearance of quiz alternatives:
                </p>
                <div className={styles.actions}>
                    <ToggleQuizMode
                        textMode={textMode}
                        setTextMode={setTextMode}
                        styles={styles}
                    />
                </div>
            </div>
            <FormCreateQuestions 
                styles={styles}
                textMode={textMode}
            />
        </>
    )
}
