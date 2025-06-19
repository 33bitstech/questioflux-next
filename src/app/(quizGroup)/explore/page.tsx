import React from 'react'

import styles from './explore.module.scss'
import ContextualHeaderActions from '@/components/NavigateWidgets/contextual-header-action'
import SearchResults from '@/components/Searching/search-results'

export default function Explore() {
    return (
        <main className={styles.content}>
            <nav className={styles.div_buttons_links}>
                    <ContextualHeaderActions page='explore'/>
            </nav>

            <div className={styles.results}>
                <h1>Explore already created quizzes</h1>
                <SearchResults styles={styles}/>
            </div>
        </main>
    )   
}
