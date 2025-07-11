import "../globals.scss";
import type { Metadata } from "next";
import { ProviderTheme} from "@/contexts/themeContext";
import { GlobalMessageProvider } from "@/contexts/globalMessageContext";
import { FilterProvider } from "@/contexts/filtersContext";
import GlobalMessageWidget from "@/components/HandlerMessage/global-message-widget";
import { UserProvider } from "@/contexts/userContext";
import { ReactNode } from "react";
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import { getMessages, getTranslations } from "next-intl/server";
import { env } from "@/env";
import AdGlobal from "@/components/Google/ad-global";

export async function generateMetadata({params}:{params:Promise<{locale:string}>}) : Promise<Metadata> {
    const {locale} = await params
    const t = await getTranslations({locale, namespace: 'mainMetadata'});

    const langs = {
        'en-US': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en`,
        'pt-BR': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/pt`,
        'x-default': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en`
    }

    return {
        title: t('title'),
        description: t('desc'),
        alternates:{
            canonical: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}`,
            languages: langs
        },
        openGraph: {
            title: t('title'),
            description: t('desc'),
            url: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}`, 
            siteName: 'Quiz Vortex',
            images: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/quiz_padrao_preto.png`,
            locale: locale == 'pt' ? 'pt_BR' : 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: t('title'),
            description: t('desc'),
            images: [`${env.NEXT_PUBLIC_DOMAIN_FRONT}/quiz_padrao_preto.png`],
        }
    }
}

const siteConfig = {
    name: "Quiz Vortex",
    domain: `${env.NEXT_PUBLIC_DOMAIN_FRONT}`,
    logo: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/site-icon-dark.svg`,
}

const generateGlobalSchema = (t:any)=> ({
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "@id": `${siteConfig.domain}/#organization`, 
            "name": siteConfig.name,
            "url": siteConfig.domain,
            "logo": siteConfig.logo
        },
        {
            "@type": "WebApplication",
            "name": siteConfig.name,
            "operatingSystem": "All",
            "applicationCategory": "EducationApplication",
            "publisher": {
                "@id": `${siteConfig.domain}/#organization`
            }
        },
        {
            "@type": "WebSite",
            "url": siteConfig.domain,
            "name": siteConfig.name,
            "publisher": { 
                "@id": `${siteConfig.domain}/#organization` 
            },
            "potentialAction": {
                "@type": "SearchAction",
                "target": `${siteConfig.domain}/explore?title={title_query}&tags={tags_query}&categories={categories_query}`,
                
                "query-input": [
                    {
                        "@type": "PropertyValueSpecification",
                        "valueName": "title_query",
                        "description": t('query_inputs.searchByTitle'),
                        "valueRequired": "http://schema.org/False" // O usuário NÃO é obrigado a preencher este campo
                    },
                    {
                        "@type": "PropertyValueSpecification",
                        "valueName": "tags_query", 
                        "description": t('query_inputs.searchByTags'),
                        "valueRequired": "http://schema.org/False"
                    },
                    {
                        "@type": "PropertyValueSpecification",
                        "valueName": "categories_query",
                        "description": t('query_inputs.searchByCategories'),
                        "valueRequired": "http://schema.org/False"
                    }
                ]
            }
        }
    ]
})

export default async function RootLayout({
    children,
    params
}: {
    children: ReactNode;
    params: Promise<{locale: string}>;
}) {
    const {locale} = await params;
    const messages = await getMessages({locale})
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    const t = await getTranslations({locale, namespace: "mainMetadata"})

    return (
        <html lang={locale} suppressHydrationWarning>

            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(generateGlobalSchema(t)) }}
                />
            </head>

            <body>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <GlobalMessageProvider>
                        <UserProvider>
                            <ProviderTheme attribute="data-theme" defaultTheme="system" enableSystem>
                                <FilterProvider>
                                    <GlobalMessageWidget />
                                    <AdGlobal/>
                                    {children}
                                </FilterProvider>
                            </ProviderTheme>
                        </UserProvider>
                    </GlobalMessageProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
