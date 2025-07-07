import React from 'react'
import Skeleton from './skeleton'
import styles from './loading-quizzes.module.scss'

export default function LoadingQuizzes({loading}:{loading:boolean}) {
    return (
        <>
            {loading && 
                <div className={styles.loading_container}>
                    <Skeleton/>
                    <Skeleton/>
                    <Skeleton/>
                </div>
            }
        </>
    )
}
