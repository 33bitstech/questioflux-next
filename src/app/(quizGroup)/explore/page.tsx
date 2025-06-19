import React from 'react'

import styles from './explore.module.scss'
import ContextualHeaderActions from '@/components/NavigateWidgets/contextual-header-action'
import SearchResults from '@/components/Searching/search-results'
import FeaturedsContainer from '@/components/Searching/featureds-container'
import IQuizes from '@/interfaces/IQuizes'
import { env } from '@/env'
import { generateQuizSchema } from '@/utils/generateSchemas'

async function getQuizzes(): Promise<IQuizes[] | undefined> {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quizzes/public`, {
            method: 'GET',
        });

        const res = await response.json();
        return res.quizzes;

    } catch (err: any) {
        console.log(err)
    }
}

export default async function Explore() {
    const quizzes = await getQuizzes(),
        baseUrl = env.NEXT_PUBLIC_DOMAIN_FRONT,

        itemListSchema = {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            'itemListElement': quizzes?.map((quiz, index) => ({
                '@type': 'ListItem',
                'position': index + 1,
                'item': generateQuizSchema(quiz, baseUrl) 
            })),
        }


    return (
        <main className={styles.content}>
            <nav className={styles.div_buttons_links}>
                    <ContextualHeaderActions page='explore'/>
            </nav>

            {/* coloca os links de todos os quizzes-card */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
            />

            <FeaturedsContainer styles={styles}/>

            <div className={styles.results}>
                <h1>Explore already created quizzes</h1>
                <SearchResults styles={styles}/>
            </div>
        </main>
    )   
}
