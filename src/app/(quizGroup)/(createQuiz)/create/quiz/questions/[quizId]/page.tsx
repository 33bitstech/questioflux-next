import React from 'react'

import styles from './questions.module.scss'
import NavCreatinQuiz from '@/components/CreatingQuiz/nav-creating-quiz'

interface IProps {
    params:{
        quizId: string
    }
}

export default async function QuestionsPage({params} : IProps) {
    const {quizId} = await params

    return (
        <main className={styles.content}>
            <div className={styles.subtitle_questions}>
                <NavCreatinQuiz
                    quizId={quizId}
                    isBacking={true}
                />
                <p>
                    Appearance of quiz alternatives:
                </p>
                {/* <div className={styles.actions}>
                    <div className={styles.quiz_mode}>
                        <button className={`${textMode ? styles.actived : ''}`}
                            onClick={(e)=>{
                                e.preventDefault()
                                setTextMode(true)
                                setImageOptionClicked(false)
                                setClickedImageMode(false)
                                dispatch(resetError())
                            }}
                        >Text only</button>

                        <button className={`${!textMode ? styles.actived : ''}`}
                            onClick={(e)=>{
                                e.preventDefault()
                                setImageMode()
                                dispatch(resetError())
                            }}
                        >Text and image</button>
                    </div>

                </div> */}
            </div>
            {/* <form onSubmit={handleSubmit}>
                <div className={styles.questions_container}>
                    {Questions?.map((question, index)=>{
                        if (textMode) {
                            return (
                                <QuestionInput 
                                    key={question.questionId}
                                    idQuestion={question.questionId} 
                                    addQuestion={handleAddQuestion}
                                    addQuestionValues={addQuestionValues}
                                    theme={theme}
                                    position={index + 1}
                                    handleScroll={handleScroll}
                                    removeQuestion={handleRemoveQuestion}
                                    QiD={question.questionId}
                                    handleFormDataQuestion={handleFormDataQuestion}
                                    errorMessage={
                                        questionError?.invalidQuestions?.find(err => err.questionId == question.questionId)
                                    }
                                />
                            )
                        }
                        if (!textMode){
                            return (
                                <QuestionImages
                                    key={question.questionId}
                                    idQuestion={question.questionId} 
                                    addQuestion={handleAddQuestion}
                                    addQuestionValues={addQuestionValues}
                                    theme={theme}
                                    position={index + 1}
                                    handleScroll={handleScroll}
                                    removeQuestion={handleRemoveQuestion}
                                    setQuestionFiles={setQuestionFiles}
                                    handleFormDataQuestion={handleFormDataQuestion}
                                    questionFiles={questionFiles}
                                    errorMessage={
                                        questionError?.invalidQuestions?.find(err => err.questionId == question.questionId)
                                    }
                                />   
                            )
                        }
                    })}
                </div>

                <footer>
                    <div className={styles.actions}>
                        <button onClick={()=>navigate('/home')}>Back</button>
                    </div>
                    <div className={styles.save}>
                        <input type='submit' value='Save as draft' disabled={loadingRed} />
                        <input type="submit" value="Continue" disabled={loadingRed} />
                    </div>
                </footer>
            </form> */}
        </main>
    )
}