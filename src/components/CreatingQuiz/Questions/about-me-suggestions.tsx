'use client'
import { useTranslations } from 'next-intl'
import { Plus } from 'lucide-react'
import styles from './about-me-suggestions.module.scss'

interface IProps {
    usedTitles: string[]
    onPick: (title: string) => void
}

const normalize = (text: string) => text.trim().toLowerCase()

// Quiz sobre mim: perguntas prontas para quem trava na hora de escrever.
export default function AboutMeSuggestions({ usedTitles, onPick }: IProps) {
    const t = useTranslations('creatingQuiz.aboutMeSuggestions')
    const used = new Set(usedTitles.map(normalize))
    const suggestions = (t.raw('items') as string[]).filter(item => !used.has(normalize(item)))

    if (suggestions.length === 0) return null

    return (
        <section className={styles.suggestions}>
            <h2>{t('title')}</h2>
            <p>{t('text')}</p>
            <ul>
                {suggestions.map(item => (
                    <li key={item}>
                        <button type='button' onClick={() => onPick(item)}>
                            <Plus aria-hidden="true" /> {item}
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    )
}
