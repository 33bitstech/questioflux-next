import React from 'react'
import styles from './loading.module.scss'
import Skeleton from '@/components/Loading/skeleton'

export default function loading() {
    return (
        <div className={styles.container}>
            <Skeleton className={styles.header}/>
            <div className={styles.middle}>
                <Skeleton/>
                <Skeleton/>
                <Skeleton/>
                <Skeleton/>
                <Skeleton/>
            </div>
            <div className={styles.questions}>
                <Skeleton/>
                <Skeleton/>
                <Skeleton/>
            </div>
        </div>
    )
}
