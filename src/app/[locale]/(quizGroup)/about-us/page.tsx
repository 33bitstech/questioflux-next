import React from 'react'
import styles from './About.module.scss'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { env } from '@/env';


interface IProps{
    params: Promise<{
        locale:string
    }>
}
export async function generateMetadata({params}:IProps) : Promise<Metadata> {
    const {locale} = await params
    const t = await getTranslations({locale, namespace: 'aboutPage'});
    
    const langs = {
        'en-US': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/about-us`,
        'pt-BR': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/pt/about-us`,
        'x-default': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/about-us`
    }

    return {
        title: t('metadataTitle'),
        alternates:{
            canonical: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/about-us`,
            languages: langs
        }
    }
}

export default async function Aboutus({params}: IProps) {
    const {locale} = await params
    const t = await getTranslations({locale, namespace:'aboutPage'});
    
    return (
        <div className={styles.container}>
            <section>
                <h1>
                    {t.rich('mainTitle', {
                        // Mapeia a tag <highlight> do JSON para um componente React <span>
                        highlight: (chunks: any) => <span>{chunks}</span>
                    })}
                </h1>
                <article>
                    <p>
                        {/* t.markup é perfeito para renderizar textos com tags simples como <br /> */}
                        {t.rich('description', {
                            br:()=><br/>
                        })}
                    </p>
                </article>
                <div className={styles.end_of_content}></div>
                <article>
                    <p>
                        {t.rich('privacy', {
                            br:()=><br/>
                        })}
                    </p>
                </article>
                <div className={styles.end_of_content}></div>
                <article>
                    <p>{t('supportLabel')} <span>33bitstech@gmail.com</span></p>
                </article>
            </section>
        </div>
    )
}