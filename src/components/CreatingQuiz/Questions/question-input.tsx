'use client'
import { ILocalQuestions } from '@/interfaces/ILocalQuestions'
import React from 'react'
import styles from './question-input.module.scss'
import CloseSvg from '@/components/Icons/CloseSvg'
import GetAnswerIcon from '@/components/Icons/GetAnswerIcon'

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
}

export default function QuestionInput({
    onAddAlternative, onAddQuestion, onAlternativeChange,
    onRemoveAlternative, onRemoveQuestion, onTitleChange,
    position, question, questions
}:IProps) {
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
                placeholder='Enter Your Question'
                value={question.title}
                onChange={(e)=>onTitleChange(e.target.value)}
            ></textarea>

            <div className={styles.alternatives}>
                {question.alternatives.map((alternative, index)=>(
                    <div className={index === 0 ? `${styles.answer} ${styles.correct_alternative}` : `${styles.answer} ${styles.incorrect_alternative}`} key={index}>
                        <span>
                            <GetAnswerIcon 
                                type={index === 0 ? 'correct' : 'incorrect'}
                            />
                        </span>
                        <input type='text'
                            onChange={e=>onAlternativeChange(index, e.target.value)}
                            value={alternative.answer}
                            placeholder={index === 0 
                                ? "Place the correct alternative here"
                                : "Place the incorrect alternative here"
                            }
                        />
                        {index > 1 && <span className={styles.deleteDiv} onClick={()=>onRemoveAlternative(index)}><CloseSvg /></span>}
                    </div>
                ))}

                <div className={styles.vertical_bar}/>

                <div className={styles.actions}>
                    <button type='button' onClick={onAddAlternative}>Add alternative</button>
                    
                    <button type='button' onClick={onAddQuestion}
                        disabled={position < questions.length}
                    >Add question</button>
                </div>
            </div>
        </div>
    )
}
