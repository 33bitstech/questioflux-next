import styles from './email-verification.module.scss'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'

interface IProps {
    params: Promise<{
        locale: string
    }>
    searchParams: Promise<{
        status?: string
    }>
}

export async function generateMetadata({ params }: IProps) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'emailVerificationPage' })

    return {
        title: `${t('metadataTitle')} | QuestioFlux`
    }
}

export default async function EmailVerificationPage({ params, searchParams }: IProps) {
    const { locale } = await params
    const resolvedSearchParams = await searchParams

    const t = await getTranslations({ locale, namespace: 'emailVerificationPage' })

    const isSuccess = resolvedSearchParams.status === 'success'

    return (
        <div className={styles.container}>
            <div className={styles.card}>

                <div className={`${styles.icon} ${isSuccess ? styles.success : styles.error}`}>
                    {isSuccess ? (
                        <svg viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                        </svg>
                    )}
                </div>

                <h1>
                    {isSuccess ? t('success.title') : t('error.title')}
                </h1>

                <p>
                    {isSuccess ? t('success.message') : t('error.message')}
                </p>

                <div className={styles.actions}>
                    <Link href="/profile/config" className={styles.primary}>
                        {t('buttons.goToProfile')}
                    </Link>

                    <Link href="/" className={styles.secondary}>
                        {t('buttons.goToHome')}
                    </Link>
                </div>

            </div>
        </div>
    )
}