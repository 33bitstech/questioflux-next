import React from 'react'

import styles from './page.module.scss'
import IQuizes from '@/interfaces/IQuizes';
import { env } from '@/env';
import Link from 'next/link';
import Participants from '@/components/widgets/participants';
import SaveQuizWidget from '@/components/widgets/save-quiz-widget';
import ShareButton from '@/components/widgets/share-button';


interface IProps {
    params: {
        quizId: string
    }
}

export async function getQuiz(quizId:string) : Promise<IQuizes|undefined> {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/${quizId}`, {
            method: 'GET',
            next:{revalidate: 60*5}
        });

        const res = await response.json();
        return res.quiz;

    } catch (err: any) {
        console.log(err)
    }
}

export default async function Quiz({params}: IProps) {
    const {quizId} = await params,
        quiz = await getQuiz(quizId)
    const transformData = (datatime: Date) => {
        const day = new Date(datatime).getDate()
        const month = new Date(datatime).getMonth() + 1
        const year = new Date(datatime).getFullYear()

        return `${day}/${month}/${year}`
    }
    return (
        <>
            <div className={styles.quiz_details}>
                <div className={styles.info}>
                    <h3>Quiz info</h3>
                    <ul>
                        {quiz && (
                            <>
                                <li>Created by: <Link href={`/user/${quiz?.userCreatorId}`}>{quiz.userCreatorName}</Link></li>
                                <li>Creation Date: <time dateTime={quiz.created_at.toString()}>{transformData(quiz.created_at)}</time></li>
                                <li>Updated: <time dateTime={quiz.updated_at.toString()}>{transformData(quiz.updated_at)}</time></li>
                                <li>Participants: <Participants quiz={quiz} styles={styles}/></li>
                                <li>Category: <span>{quiz.category}</span></li>
                                {quiz?.tags && quiz.tags.length > 0 ? <li>
                                    Tags: { quiz.tags?.map((tag, i)=>(
                                        <span key={i}>
                                            <strong>{tag}</strong>{quiz.tags && i < (quiz.tags.length-1) ? ', ' : ''}
                                        </span>
                                    )) }
                                </li> : <></>}
                            </>
                        )}
                    </ul>
                </div>
                <div className={styles.actions}>
                    <Link href={`/quiz/${quizId}/taking`}>Take the quiz</Link>
                    <SaveQuizWidget quizId={quizId} />
                    <ShareButton styles={styles} quizId={quizId}/>
                </div>
                <div className={styles.description_container}>
                    <h2>{quiz?.description}</h2>
                </div>
            </div>
            <footer className={styles.footer}></footer>
        </>
    )
}
