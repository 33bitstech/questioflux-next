'use client'
import { ILocalQuestions } from '@/interfaces/ILocalQuestions'
import React from 'react'
import styles from './question-input.module.scss'
import CloseSvg from '@/components/Icons/CloseSvg'
import GetAnswerIcon from '@/components/Icons/GetAnswerIcon'
import { useTranslations } from 'next-intl'
import ExplanationInput from './explanation-input'
import ResultSelect from './result-select'
import { effectiveResultId, IResultOption } from '@/utils/personalityQuestions'

interface IProps{
    question:ILocalQuestions
    position: number
    questions: ILocalQuestions[]
    onTitleChange: (title: string) => void
    onAlternativeChange: (altIndex: number, answer:string) => void
    onAddAlternative: () => void
    onAddQuestion: () => void
    onRemoveAlternative: (altIndex: number) => void
    onRemoveQuestion: () => void
    // prova online: cada alternativa pode ter uma explicação
    showExplanations?: boolean
    onAlternativeExplanationChange?: (altIndex: number, text: string) => void
    // quiz de personalidade: sem alternativa certa; cada uma leva a um resultado
    resultOptions?: IResultOption[]
    onAlternativeResultChange?: (altIndex: number, resultId: string) => void
}

export default function QuestionInput({
    onAddAlternative, onAddQuestion, onAlternativeChange,
    onRemoveAlternative, onRemoveQuestion, onTitleChange,
    position, question, questions,
    showExplanations, onAlternativeExplanationChange,
    resultOptions, onAlternativeResultChange
}:IProps) {
    const isPersonality = !!resultOptions && !!onAlternativeResultChange

    const t = useTranslations('creatingQuiz.questionsForm.textInput')
    return (
        <div className={styles.question_inputs}>
            <div className={styles.header_question}>
                <div className={styles.circle_background}>
                    <div className={styles.circle_container}>
                        <span>{position}</span>
                    </div>
                </div>

                {question.errorMessage && <p className={styles.message_error_input}>{question.errorMessage}</p>}

                { position > 1 && <span 
                    className={`${styles.deleteDiv} ${styles.deleteQuestion}`} 
                    onClick={onRemoveQuestion}
                >
                    <CloseSvg />
                </span>}
            </div>

            <textarea 
                className={styles.question_textarea}
                placeholder={t('placeholder')}
                value={question.title}
                onChange={(e)=>onTitleChange(e.target.value)}
            ></textarea>

            <div className={styles.alternatives}>
                {question.alternatives.map((alternative, index)=>{
                    const resultId = isPersonality ? effectiveResultId(alternative, index, resultOptions) : ''
                    const resultColor = resultOptions?.find(option => option.resultId === resultId)?.color

                    return (
                    <div className={styles.alternative_block} key={alternative.id || index}>
                        <div
                            className={isPersonality
                                ? `${styles.answer} ${styles.personality_alternative}`
                                : index === 0 ? `${styles.answer} ${styles.correct_alternative}` : `${styles.answer} ${styles.incorrect_alternative}`}
                            style={isPersonality ? { ['--result-color' as string]: resultColor } : undefined}
                        >
                            {!isPersonality && <span>
                                <GetAnswerIcon
                                    type={index === 0 ? 'correct' : 'incorrect'}
                                />
                            </span>}
                            <input type='text'
                                onChange={e=>onAlternativeChange(index, e.target.value)}
                                value={alternative.answer}
                                placeholder={isPersonality
                                    ? t('personalityPlaceholder', { number: index + 1 })
                                    : index === 0
                                        ? t('correctPlaceholder')
                                        : t('incorrectPlaceholder')
                                }
                            />
                            {isPersonality && (
                                <ResultSelect
                                    value={resultId}
                                    options={resultOptions}
                                    onChange={(id) => onAlternativeResultChange(index, id)}
                                />
                            )}
                            {index > 1 && <span className={styles.deleteDiv} onClick={()=>onRemoveAlternative(index)}><CloseSvg /></span>}
                        </div>
                        {showExplanations && onAlternativeExplanationChange && (
                            <ExplanationInput
                                value={alternative.explanation}
                                correct={index === 0}
                                onChange={(text) => onAlternativeExplanationChange(index, text)}
                            />
                        )}
                    </div>
                    )
                })}

                <div className={styles.vertical_bar}/>

                <div className={styles.actions}>
                    <button type='button' onClick={onAddAlternative}>{t('addAlternative')}</button>
                    
                    <button type='button' onClick={onAddQuestion}
                        disabled={position < questions.length}
                    >{t('addQuestion')}</button>
                </div>
            </div>
        </div>
    )
}
