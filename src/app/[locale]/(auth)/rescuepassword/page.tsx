// @ts-ignore: SCSS side-effect import declaration
import '@/assets/styles/auth.scss'
import KeysSvg from '@/components/Icons/KeysSvg'
import RescuePasswordForm from '@/components/AuthForms/Auth-client-components/rescue-password-form'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { env } from '@/env'

interface IProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const {locale} = await params
    const t = await getTranslations({ locale, namespace: 'rescuePasswordFlow.rescuePage' });

    const langs = {
        'es': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/es/rescuepassword`,
        'en-US': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/rescuepassword`,
        'pt-BR': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/pt/rescuepassword`,
        'zh-CN': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/zh/rescuepassword`,
        'x-default': `${env.NEXT_PUBLIC_DOMAIN_FRONT}/en/rescuepassword`
    }

    return {
        title: t('metadataTitle'),
        robots: `noindex, follow`,
        alternates:{
            canonical: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/rescuepassword`,
            languages: langs
        },
        openGraph: {
            title: t('metadataTitle'),
            url: `${env.NEXT_PUBLIC_DOMAIN_FRONT}/${locale}/rescuepassword`, 
        },
        twitter: {
            title: t('metadataTitle'),
        }
    }
}

export default async function RescuePassword({ params }: IProps) {
    const {locale} = await params
    const t = await getTranslations({ locale, namespace: 'rescuePasswordFlow.rescuePage' });

    return (
        <div className='container-section'>
            <section className='forgotpass-section'>
                <KeysSvg />
                <RescuePasswordForm 
                    locale={locale}
                />
                <p>{t('registerPrompt')} <Link href='/register'>{t('registerLink')}</Link></p>
            </section>
        </div>
    )
}