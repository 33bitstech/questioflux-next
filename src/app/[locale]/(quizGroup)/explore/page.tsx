import React from 'react'
import styles from './explore.module.scss'
import ContextualHeaderActions from '@/components/NavigateWidgets/contextual-header-action'
import SearchResults from '@/components/Searching/search-results'
import FeaturedsContainer from '@/components/Searching/featureds-container'
import { env } from '@/env'
import { generateExploreQuizSchema } from '@/utils/generateSchemas'
import { getTranslations } from 'next-intl/server' 
import { Metadata } from 'next'
import GoogleAd from '@/components/Google/GoogleAd'
import { getQuizzes, getFeaturedsQuizzes} from './actions'

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
            url: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/explore`, 
            siteName: 'QuestioFlux',
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


export default async function Explore({ params }: IProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'explorePage' });
    const [quizzes, popularQuizzes] = await Promise.all([
        await getQuizzes(),
        await getFeaturedsQuizzes()
    ])
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

            <FeaturedsContainer styles={styles} defaultQuizzes={popularQuizzes!}/>

            <GoogleAd/>
            
            <div className={styles.results}>
                {/* Usar a tradução */}
                <h1>{t('mainTitle')}</h1>
                <SearchResults styles={styles} defaultQuizzes={quizzes!}/>
            </div>
            <GoogleAd/>
        </main>
    )   
}