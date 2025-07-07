import React from 'react'
import styles from './explore.module.scss'
import ContextualHeaderActions from '@/components/NavigateWidgets/contextual-header-action'
import SearchResults from '@/components/Searching/search-results'
import FeaturedsContainer from '@/components/Searching/featureds-container'
import IQuizes from '@/interfaces/IQuizes'
import { env } from '@/env'
import { generateQuizSchema } from '@/utils/generateSchemas'
import { getTranslations } from 'next-intl/server' // Importar
import { Metadata } from 'next'
import Skeleton from '@/components/Loading/skeleton'

interface IProps {
    params: Promise<{
        locale: string
    }>
}

// Adicionando generateMetadata para o título da página
export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const {locale} = await params
    const t = await getTranslations({ locale, namespace: 'explorePage' });
    return {
        title: t('metadataTitle')
    }
}

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

export default async function Explore({ params }: IProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'explorePage' }); // Buscar traduções
    const quizzes = await getQuizzes();
    const baseUrl = env.NEXT_PUBLIC_DOMAIN_FRONT;

    const itemListSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'itemListElement': quizzes?.map((quiz, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'item': generateQuizSchema(quiz, baseUrl) 
        })),
    };

    return (
        <main className={styles.content}>
            <nav className={styles.div_buttons_links}>
                <ContextualHeaderActions page='explore' locale={locale}/>
            </nav>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
            />

            <FeaturedsContainer styles={styles}/>
            
            <div className={styles.results}>
                {/* Usar a tradução */}
                <h1>{t('mainTitle')}</h1>
                <SearchResults styles={styles}/>
            </div>
        </main>
    )   
}