import Link from 'next/link'
import React from 'react'
import styles from './contextual-header-action.module.scss'
import ToggleFilterContainer from './filtersWidgets/toggle-filter-container'
import {getCookie} from 'cookies-next/server'
import { cookies } from 'next/headers'

interface IProps {
    page: 'home' | 'explore' | 'quiz'
}

export default async function ContextualHeaderActions({page} : IProps) {
    const token = await getCookie('token', {cookies})
    return (
        <div className={`${styles.nav_actions}`}>
            <Link href={'/create/quiz'}>Create Quiz</Link>

            {page === 'home' && (
                <Link href={'/explore'}>Explore Quizzes</Link>
            )}
            {page === 'explore' && (
                <ToggleFilterContainer styles={styles}/>
            )}
            {page === 'quiz' && token && (
                <Link href={'/home'}>Home</Link>
            )}
            {page === 'quiz' && !token && (
                <Link href={'/explore'}>Explore</Link>
            )}
        </div>
    )
}
