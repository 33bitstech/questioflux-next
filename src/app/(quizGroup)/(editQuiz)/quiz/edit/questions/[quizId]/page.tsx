import React from 'react'
import styles from '../../../../../(createQuiz)/create/quiz/questions/[quizId]/questions.module.scss'
import FormEditQuiz from '@/components/EditingQuiz/form-edit-quiz'
import IQuizes from '@/interfaces/IQuizes'
import { env } from '@/env'
import FormEditQuestions from '@/components/EditingQuiz/form-edit-questions'

interface IProps{
    params:{
        quizId: string
    }
}

export async function getQuiz(quizId:string) : Promise<IQuizes|undefined> {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/${quizId}`, {
            method: 'GET'
        });

        const res = await response.json();
        return res.quiz;

    } catch (err: any) {
        console.log(err)
    }
}

export default async function EditingQuiz({params}:IProps) {
    const {quizId} = await params,
        quiz = await getQuiz(quizId)

    return (
        <main className={styles.content}>
            <div className={styles.subtitle_questions}>
                <h1>Edit your quiz questions</h1>
                <p>
                    Once you're done with your changes, click 'Save Changes' to apply them. Need to edit the quiz? Simply click 'Edit Quiz'.
                </p>
            </div>


            <FormEditQuestions 
                styles={styles}
                quiz={quiz}
            />
        </main>
    )
}
