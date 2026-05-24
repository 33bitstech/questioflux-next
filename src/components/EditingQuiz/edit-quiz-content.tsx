'use client'

import { useState } from 'react'
import ToggleQuizMode from '@/components/widgets/toggle-quiz-mode'
import FormEditQuestions from '@/components/EditingQuiz/form-edit-questions'
import { TStyles } from '@/types/stylesType'
import IQuizes from '@/interfaces/IQuizes'
import { useTranslations } from 'next-intl'

interface IProps {
    styles: TStyles
    quiz: IQuizes | undefined | { err: any }
    quizId: string
}

export default function EditQuizContent({ styles, quiz, quizId }: IProps) {
    const t = useTranslations('creatingQuiz.questionsPage')
    const [textMode, setTextMode] = useState<boolean>(true)

    const isQuizError = quiz && 'err' in quiz
    const quizData = quiz as IQuizes | undefined
    const questions = quizData?.questions

    const hasQuestions =
        !isQuizError &&
        Array.isArray(questions) &&
        questions.length > 0

    return (
        <>
            {!hasQuestions && (
                <div className={styles.subtitle_questions}>
                    <p>{t('alternativesAppearance')}</p>

                    <div className={styles.actions}>
                        <ToggleQuizMode
                            textMode={textMode}
                            setTextMode={setTextMode}
                            styles={styles}
                        />
                    </div>
                </div>
            )}

            <FormEditQuestions
                styles={styles}
                quiz={quiz}
                quizId={quizId}
                textMode={textMode}
            />
        </>
    )
}