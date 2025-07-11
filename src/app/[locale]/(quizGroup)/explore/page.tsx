'use server'
import React from 'react'
import styles from './explore.module.scss'
import ContextualHeaderActions from '@/components/NavigateWidgets/contextual-header-action'
import SearchResults from '@/components/Searching/search-results'
import FeaturedsContainer from '@/components/Searching/featureds-container'
import IQuizes from '@/interfaces/IQuizes'
import { env } from '@/env'
import { generateExploreQuizSchema } from '@/utils/generateSchemas'
import { getTranslations } from 'next-intl/server' 
import { Metadata } from 'next'
import GoogleAd from '@/components/Google/GoogleAd'

interface IProps {
    params: Promise<{
        locale: string
    }>
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const {locale} = await params
    const t = await getTranslations({ locale, namespace: 'explorePage' });

    const langs = {
        'en-US': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/explore`,
        'pt-BR': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/pt/explore`,
        'x-default': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/explore`
    }

    return {
        title: t('metadataTitle'),
        description: t('metadataDesc'),
        robots: 'index, follow',
        keywords: "quiz, explore, play",
        alternates:{
            canonical: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/explore`,
            languages: langs
        },
        openGraph: {
            title: t('metadataTitle'),
            description: t('metadataDesc'),
            url: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/explore`, 
            siteName: 'Quiz Vortex',
            images: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/quiz_padrao_preto.png`,
            locale: locale == 'pt' ? 'pt_BR' : 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: t('metadataTitle'),
            description: t('metadataDesc'),
            images: [`${env.NEXT_PUBLIC_DOMAIN_FRONT}/quiz_padrao_preto.png`],
        }
    }
}

export async function getQuizzes(): Promise<IQuizes[] | undefined> {
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
export async function getFeaturedsQuizzes(): Promise<IQuizes[] | undefined> {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quizzes/featured`, {
            method: 'GET',
        });
        const res = await response.json();
        return res.quizzesSort;
    } catch (err: any) {
        console.log(err)
    }
}

export default async function Explore({ params }: IProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'explorePage' }); // Buscar traduções
    const quizzes = await getQuizzes();
    const baseUrl = `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}`;

    const itemListSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'itemListElement': quizzes?.slice(0,30).map((quiz, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'item': generateExploreQuizSchema(quiz, baseUrl, env.NEXT_PUBLIC_DOMAIN_FRONT) 
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

            <GoogleAd/>
            
            <div className={styles.results}>
                {/* Usar a tradução */}
                <h1>{t('mainTitle')}</h1>
                <SearchResults styles={styles}/>
            </div>
            <GoogleAd/>
        </main>
    )   
}