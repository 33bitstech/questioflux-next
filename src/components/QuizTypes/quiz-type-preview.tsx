import { getTranslations } from 'next-intl/server'
import { Check, X } from 'lucide-react'
import { QuizKind } from '@/utils/quizKind'
import { TStyles } from '@/types/stylesType'

interface ISample {
    question: string
    answers: string[]
    correct: number
    chosen?: number
    chosenExplanation?: string
    correctExplanation?: string
    score?: string
    current?: number
    total?: number
    rankingTitle?: string
    ranking?: Array<{ name: string, score: string, time: string }>
    // personalidade: o perfil que saiu e quanto deu cada um
    resultLabel?: string
    resultTitle?: string
    resultText?: string
    breakdown?: Array<{ title: string, percent: number }>
}

interface IProps {
    kind: QuizKind
    locale: string
    styles: TStyles
}

// Exemplo de como o tipo fica para quem joga: a correção na prova, o perfil na
// personalidade e o ranking nos outros.
export default async function QuizTypePreview({ kind, locale, styles }: IProps) {
    const [t, tCommon] = await Promise.all([
        getTranslations({ locale, namespace: `quizTypePages.${kind}` }),
        getTranslations({ locale, namespace: 'quizTypePages.common' }),
    ])

    const sample = t.raw('sample') as ISample
    const isExam = kind === 'exam'
    const isPersonality = kind === 'personality'

    return (
        <figure className={styles.preview} aria-label={tCommon('previewLabel')}>
            <figcaption className={styles.preview_label}>{tCommon('previewLabel')}</figcaption>

            {isExam && (
                <div className={styles.preview_header}>
                    <span>{tCommon('preview.questionOf', { current: sample.current ?? 1, total: sample.total ?? 10 })}</span>
                    <span className={styles.preview_wrong_badge}><X aria-hidden="true" /> {tCommon('preview.wrong')}</span>
                    <strong>{tCommon('preview.score', { score: sample.score ?? '' })}</strong>
                </div>
            )}

            <p className={styles.preview_question}>{sample.question}</p>

            <ul className={styles.preview_answers}>
                {sample.answers.map((answer, index) => {
                    // na personalidade não tem certa: só a alternativa escolhida fica marcada
                    if (isPersonality) {
                        const picked = index === sample.chosen
                        return (
                            <li key={answer} className={picked ? styles.preview_picked : ''}>
                                <div className={styles.preview_answer_row}>
                                    <span className={styles.preview_marker} aria-hidden="true">
                                        {picked ? <Check /> : String.fromCharCode(65 + index)}
                                    </span>
                                    <span>{answer}</span>
                                </div>
                            </li>
                        )
                    }

                    const isCorrect = index === sample.correct
                    const isChosen = isExam && index === sample.chosen && !isCorrect
                    const explanation = isExam
                        ? (isCorrect ? sample.correctExplanation : isChosen ? sample.chosenExplanation : undefined)
                        : undefined

                    return (
                        <li
                            key={answer}
                            className={isCorrect ? styles.preview_correct : isChosen ? styles.preview_chosen : ''}
                        >
                            <div className={styles.preview_answer_row}>
                                <span className={styles.preview_marker} aria-hidden="true">
                                    {isCorrect ? <Check /> : isChosen ? <X /> : String.fromCharCode(65 + index)}
                                </span>
                                <span>{answer}</span>
                                {isExam && (isCorrect || isChosen) && (
                                    <em>{isCorrect ? tCommon('preview.correctAnswer') : tCommon('preview.yourAnswer')}</em>
                                )}
                            </div>
                            {explanation && <p className={styles.preview_explanation}>{explanation}</p>}
                        </li>
                    )
                })}
            </ul>

            {isPersonality && (
                <div className={styles.preview_result}>
                    <span>{sample.resultLabel}</span>
                    <strong>{sample.resultTitle}</strong>
                    <p>{sample.resultText}</p>
                    <ul>
                        {sample.breakdown?.map(item => (
                            <li key={item.title}>
                                <span>{item.title}</span>
                                <span className={styles.preview_bar}><span style={{ width: `${item.percent}%` }} /></span>
                                <span>{item.percent}%</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {!isExam && !isPersonality && sample.ranking && (
                <div className={styles.preview_ranking}>
                    <strong>{sample.rankingTitle}</strong>
                    <ol>
                        {sample.ranking.map((row, index) => (
                            <li key={row.name}>
                                <span className={styles.preview_position}>{index + 1}</span>
                                <span>{row.name}</span>
                                <span>{row.score}</span>
                                <time>{row.time}</time>
                            </li>
                        ))}
                    </ol>
                </div>
            )}
        </figure>
    )
}
