'use client'
import { ILocalQuestions } from '@/interfaces/ILocalQuestions'
import React from 'react'
import styles from './question-input-image.module.scss'
import CloseSvg from '@/components/Icons/CloseSvg'
import GetAnswerIcon from '@/components/Icons/GetAnswerIcon'
import InputTitle from './ImagesInputs/input-title'
import InputAlternative from './ImagesInputs/input-alternative'
import { useTranslations } from 'next-intl'
import { BrushCleaning } from 'lucide-react'
import ExplanationInput from './explanation-input'
import ResultSelect from './result-select'
import { effectiveResultId, IResultOption } from '@/utils/personalityQuestions'

interface IProps {
    question: ILocalQuestions
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
    onAlternativeTextChange: (altIndex: number, text: string) => void
    onAlternativeImageClear: (altIndex: number) => void
    // prova online: cada alternativa pode ter uma explicação
    showExplanations?: boolean
    onAlternativeExplanationChange?: (altIndex: number, text: string) => void
    // quiz de personalidade: sem alternativa certa; cada uma leva a um resultado
    resultOptions?: IResultOption[]
    onAlternativeResultChange?: (altIndex: number, resultId: string) => void
}

export default function QuestionInputImage({
    onAddAlternative, onAddQuestion, onAlternativeImageChange,
    onRemoveAlternative, onRemoveQuestion, onTitleChange,
    position, question, questions, onQuestionImageChange,
    onMultipleImageUpload, onAlternativeTextChange, onAlternativeImageClear,
    showExplanations, onAlternativeExplanationChange,
    resultOptions, onAlternativeResultChange
}: IProps) {
    const isPersonality = !!resultOptions && !!onAlternativeResultChange
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
                        onChange={e => {
                            onTitleChange(e.target.value)
                        }}
                    />

                    {position > 1 && <span className={`${styles.deleteDiv} ${styles.deleteQuestion}`} onClick={() => onRemoveQuestion()}>
                        <CloseSvg />
                    </span>}

                </div>
            </div>
            {/* alternativas */}
            <div className={styles.alternatives_container}>
                {question.alternatives.map((alternative, index) => {
                    const resultId = isPersonality ? effectiveResultId(alternative, index, resultOptions) : ''
                    const resultColor = resultOptions?.find(option => option.resultId === resultId)?.color

                    return (
                    <div className={styles.alternative_block} key={alternative.id}>
                    <div
                        className={`${styles.input_container} ${isPersonality ? styles.personality : index === 0 ? styles.correct : styles.incorrect}`}
                        style={isPersonality ? { ['--result-color' as string]: resultColor } : undefined}
                    >
                        {alternative.thumbnail && (
                            <button
                                type="button"
                                className={styles.clear_image_button}
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    onAlternativeImageClear(index)
                                }}
                            >
                                <BrushCleaning />
                            </button>
                        )}

                        <InputAlternative
                            alternative={alternative}
                            styles={styles}
                            i={index}
                            onAlternativeImageChange={onAlternativeImageChange}
                        />

                        <div className={styles.footer_input}>
                            {!isPersonality && <span>
                                <GetAnswerIcon
                                    type={index === 0 ? 'correct' : 'incorrect'}
                                />
                            </span>}

                            <input
                                className={styles.alternative_text_input}
                                type="text"
                                placeholder={t('imageInput.alternativeLabel', { number: index + 1 })}
                                value={alternative.text || ''}
                                onChange={(e) => onAlternativeTextChange(index, e.target.value)}
                            />

                            {index > 1 && (
                                <span className={styles.deleteDiv} onClick={() => onRemoveAlternative(index)}>
                                    <CloseSvg />
                                </span>
                            )}
                        </div>
                    </div>
                    {showExplanations && onAlternativeExplanationChange && (
                        <ExplanationInput
                            value={alternative.explanation}
                            correct={index === 0}
                            onChange={(text) => onAlternativeExplanationChange(index, text)}
                        />
                    )}
                    {isPersonality && (
                        <ResultSelect
                            value={resultId}
                            options={resultOptions}
                            onChange={(id) => onAlternativeResultChange(index, id)}
                        />
                    )}
                    </div>
                    )
                })}
            </div>

            <div className={styles.vertical_bar} />

            <div className={styles.actions}>
                <button type='button' onClick={onAddAlternative}>{t('textInput.addAlternative')}</button>

                <button type='button' onClick={onAddQuestion}
                    disabled={position < questions.length}
                >{t('textInput.addQuestion')}</button>
            </div>
        </div>
    )
}