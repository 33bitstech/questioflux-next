'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowLeft, Check, Circle } from 'lucide-react'
import { IChoiceQuestion } from '@/interfaces/IExperience'
import styles from '../experiences.module.scss'

interface IProps {
    questions: IChoiceQuestion[]
    onFinish: (answers: Record<string, string>) => void
    disabled?: boolean
}

// Compatibilidade e pontuação: uma pergunta por vez, uma alternativa em cada. Escolher passa
// para a próxima; dá para voltar e trocar antes de terminar.
export default function QuestionsPlay({ questions, onFinish, disabled }: IProps) {
    const t = useTranslations('experiencePlay')
    const [index, setIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const question = questions[index]
    const answeredAll = questions.every(item => !!answers[item.questionId])
    const isLast = index === questions.length - 1

    if (!question) return null

    const select = (answerId: string) => {
        if (disabled) return
        const next = { ...answers, [question.questionId]: answerId }
        setAnswers(next)
        if (!isLast) setIndex(index + 1)
    }

    const progress = Math.round(Object.keys(answers).length / questions.length * 100)

    return (
        <div className={styles.play}>
            <div className={styles.play_header}>
                <strong>{t('questions.questionOf', { number: index + 1, total: questions.length })}</strong>
            </div>
            <div className={styles.progress} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
                <span style={{ width: `${progress}%` }} />
            </div>

            <div className={styles.question}>
                <h2>{question.question}</h2>
                <ul className={styles.choices}>
                    {question.answers.map(answer => {
                        const selected = answers[question.questionId] === answer.answerId
                        return (
                            <li key={answer.answerId}>
                                <button
                                    type="button"
                                    className={`${styles.choice} ${selected ? styles.choice_selected : ''}`}
                                    aria-pressed={selected}
                                    onClick={() => select(answer.answerId)}
                                    disabled={disabled}
                                >
                                    {selected ? <Check aria-hidden="true" /> : <Circle aria-hidden="true" />}
                                    <span>{answer.text}</span>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </div>

            <div className={styles.play_footer}>
                <button type="button" className={styles.button_link} onClick={() => setIndex(index - 1)} disabled={disabled || index === 0}>
                    <ArrowLeft aria-hidden="true" /> {t('back')}
                </button>
                {isLast && (
                    <button type="button" className={styles.button_primary} onClick={() => onFinish(answers)} disabled={disabled || !answeredAll}>
                        {t('questions.finish')}
                    </button>
                )}
            </div>
        </div>
    )
}
