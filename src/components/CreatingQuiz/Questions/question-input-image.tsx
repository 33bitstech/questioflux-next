'use client'
import { ILocalQuestions } from '@/interfaces/ILocalQuestions'
import React from 'react'
import styles from './question-input-image.module.scss'
import CloseSvg from '@/components/Icons/CloseSvg'
import GetAnswerIcon from '@/components/Icons/GetAnswerIcon'
import InputTitle from './ImagesInputs/input-title'
import InputAlternative from './ImagesInputs/input-alternative'

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
}

export default function QuestionInputImage({
    onAddAlternative, onAddQuestion, onAlternativeImageChange,
    onRemoveAlternative, onRemoveQuestion, onTitleChange,
    position, question, questions, onQuestionImageChange
}:IProps) {
    return (
        <div className={`${styles.question_inputs}`}>

            <div className={styles.input_container}>

                {question.errorMessage && <p className={styles.message_error_input}>{question.errorMessage}</p>}


                <InputTitle 
                    styles={styles}
                    question={question}
                    onQuestionImageChange={onQuestionImageChange}
                />

                <div className={styles.footer_input}>
                    <div className={styles.circle_background}>
                        <div className={styles.circle_container}>
                            <span>{position}</span>
                        </div>
                    </div>
                    <input 
                        type="text" 
                        placeholder={`Question N°${position}`} 
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
                            <p>Alternative N°<span>{index+1}</span></p>

                            {index > 1 && <span className={styles.deleteDiv} onClick={()=>onRemoveAlternative(index)}>
                                <CloseSvg/>
                            </span>}
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.vertical_bar}/>

            <div className={styles.actions}>
                <button type='button' onClick={onAddAlternative}>Add alternative</button>
                
                <button type='button' onClick={onAddQuestion}
                        disabled={position < questions.length}
                    >Add question</button>
            </div>
        </div>
    )
}
