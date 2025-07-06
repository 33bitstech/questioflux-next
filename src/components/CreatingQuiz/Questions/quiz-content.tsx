'use client'

import ToggleQuizMode from '@/components/widgets/toggle-quiz-mode'
import { TStyles } from '@/types/stylesType'
import React, { useState } from 'react'
import FormCreateQuestions from './form-create-questions'
import NavCreatinQuiz from '../nav-creating-quiz'
import { useLocale, useTranslations } from 'next-intl' // Importar useTranslations

interface IProps{
    styles: TStyles
    quizId: string
}

export default function QuizContent({styles, quizId}:IProps) {
    const t = useTranslations('creatingQuiz.questionsPage'); // Inicializar hook
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
                    {/* Usar tradução */}
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
            {/* Se FormCreateQuestions tiver texto, também precisará ser traduzido internamente */}
            <FormCreateQuestions 
                styles={styles}
                textMode={textMode}
                quizId={quizId}
            />
        </>
    )
}   