'use client'
import { ILocalQuestions } from '@/interfaces/ILocalQuestions'
import React from 'react'
import styles from './question-input-image.module.scss'
import CloseSvg from '@/components/Icons/CloseSvg'
import GetAnswerIcon from '@/components/Icons/GetAnswerIcon'
import InputTitle from './ImagesInputs/input-title'
import InputAlternative from './ImagesInputs/input-alternative'
import { useTranslations } from 'next-intl'

interface IProps{
    question:ILocalQuestions
    position: number
    questions: ILocalQuestions[]
    onTitleChange: (title: string) => void
    onQuestionImageChange: (file: File | string) => void
    onAlternativeImageChange: (altIndex: number, file: File | string) => void
    onAddAlternative: () => void
    onAddQuestion: () => void
    onRemoveAlternative: (altIndex: number) => void
    onRemoveQuestion: () => void
    onMultipleImageUpload: (files: FileList) => void
}

export default function QuestionInputImage({
    onAddAlternative, onAddQuestion, onAlternativeImageChange,
    onRemoveAlternative, onRemoveQuestion, onTitleChange,
    position, question, questions, onQuestionImageChange,
    onMultipleImageUpload
}:IProps) {
    const t = useTranslations('creatingQuiz.questionsForm')
    return (
        <div className={`${styles.question_inputs}`}>

            <div className={styles.input_container}>

                {question.errorMessage && <p className={styles.message_error_input}>{question.errorMessage}</p>}

                <InputTitle 
                    styles={styles}
                    question={question}
                    onQuestionImageChange={onQuestionImageChange}
                    onMultipleImageUpload={onMultipleImageUpload}
                />

                <div className={styles.footer_input}>
                    <div className={styles.circle_background}>
                        <div className={styles.circle_container}>
                            <span>{position}</span>
                        </div>
                    </div>
                    <input 
                        type="text" 
                        placeholder={t('imageInput.placeholder', { position })}
                        value={question.title}
                        onChange={e=>{
                            onTitleChange(e.target.value)
                        }} 
                    />

                    { position > 1 && <span className={`${styles.deleteDiv} ${styles.deleteQuestion}`} onClick={()=>onRemoveQuestion()}>
                        <CloseSvg/>
                    </span>}

                </div>
            </div>
            {/* alternativas */}
            <div className={styles.alternatives_container}>
                {question.alternatives.map((alternative, index)=>(
                    <div className={`${styles.input_container} ${index === 0 ? styles.correct : styles.incorrect}`} key={index}>
                        <InputAlternative
                            alternative={alternative}
                            styles={styles}
                            i={index}
                            onAlternativeImageChange={onAlternativeImageChange}
                        />
                        <div className={styles.footer_input}>
                            <span>
                                <GetAnswerIcon 
                                    type={index === 0 ? 'correct' : 'incorrect'}
                                />
                            </span>
                            <p>{t('imageInput.alternativeLabel', { number: index + 1 })}</p>

                            {index > 1 && <span className={styles.deleteDiv} onClick={()=>onRemoveAlternative(index)}>
                                <CloseSvg/>
                            </span>}
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.vertical_bar}/>

            <div className={styles.actions}>
                <button type='button' onClick={onAddAlternative}>{t('textInput.addAlternative')}</button>
                
                <button type='button' onClick={onAddQuestion}
                    disabled={position < questions.length}
                >{t('textInput.addQuestion')}</button>
            </div>
        </div>
    )
}