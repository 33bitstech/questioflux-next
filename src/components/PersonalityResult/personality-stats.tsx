import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import IQuizes from '@/interfaces/IQuizes'
import styles from './personality-result.module.scss'

interface IProps {
    quiz: IQuizes
    locale: string
}

// Aba "Resultados" do quiz de personalidade: quanto cada perfil saiu entre todo mundo
// que já fez. Fica no lugar do ranking, que não existe nesse tipo.
export default async function PersonalityStats({ quiz, locale }: IProps) {
    const t = await getTranslations({ locale, namespace: 'personalityResultPage.stats' })

    const stats = quiz.personalityStats ?? {}
    const plays = Object.values(stats).reduce((sum, count) => sum + (Number(count) || 0), 0)

    const results = (quiz.personalityResults ?? [])
        .map(result => {
            const count = Number(stats[result.resultId]) || 0
            return { ...result, count, percent: plays ? Math.round(count / plays * 100) : 0 }
        })
        .sort((a, b) => b.count - a.count)

    return (
        <section className={styles.stats}>
            <div className={styles.stats_header}>
                <h2>{t('title')}</h2>
                <p>{plays ? t('plays', { count: plays }) : t('noPlays')}</p>
                <Link href={`/quiz/${quiz.quizId}/taking`} locale={locale} className={styles.button_primary}>{t('cta')}</Link>
            </div>

            <ul className={styles.stats_list}>
                {results.map(result => (
                    <li key={result.resultId}>
                        {result.image
                            ? <Image src={result.image} alt={result.title} width={112} height={112} className={styles.stats_image} />
                            : <span className={styles.stats_image} aria-hidden="true">{result.title.charAt(0).toUpperCase()}</span>}
                        <div className={styles.stats_text}>
                            <div className={styles.stats_title}>
                                <strong>{result.title}</strong>
                                <span>{result.percent}%</span>
                            </div>
                            <span className={styles.bar} aria-hidden="true"><span style={{ width: `${result.percent}%` }} /></span>
                            {result.description && <p>{result.description}</p>}
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    )
}
