'use client'

import ToggleQuizMode from '@/components/widgets/toggle-quiz-mode'
import { TStyles } from '@/types/stylesType'
import React, { useState } from 'react'
import FormCreateQuestions from './form-create-questions'
import NavCreatinQuiz from '../nav-creating-quiz'
import { useLocale, useTranslations } from 'next-intl' 

interface IProps{
    styles: TStyles
    quizId: string
}

export default function QuizContent({styles, quizId}:IProps) {
    const t = useTranslations('creatingQuiz.questionsPage'); 
    const [textMode, setTextMode] = useState<boolean>(true);
    const locale = useLocale();

    return (
        <>
            <div className={styles.subtitle_questions}>
                <NavCreatinQuiz
                    quizId={quizId}
                    isBacking={true}
                    locale={locale}
                />
                <p>
                    {t('alternativesAppearance')}
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
                quizId={quizId}
            />
        </>
    )
}   