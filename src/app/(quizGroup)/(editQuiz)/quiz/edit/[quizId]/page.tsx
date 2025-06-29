import React from 'react'
import styles from '../../../../(createQuiz)/create/quiz/cover/cover.module.scss'
import FormEditQuiz from '@/components/EditingQuiz/form-edit-quiz'
import IQuizes from '@/interfaces/IQuizes'
import { env } from '@/env'

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
            <div className={styles.subtitle_creations}>
                <h1>Edit your quiz</h1>
                <p>
                    Once you're done with your changes, click 'Save Changes' to apply them. Need to edit the questions? Simply click 'Edit Questions'.
                </p>
            </div>

            {/* {!isAuth && canShowRegister && <RegisterForm pageReg={false} absolute={true} canNavigate={false} handleRegisterAndFinishQuiz={handleRegisterAndFinishQuiz} show_pop_up={setCanShowRegister}/>} */}

            <FormEditQuiz 
                styles={styles}
                quiz={quiz}
            />
        </main>
    )
}
