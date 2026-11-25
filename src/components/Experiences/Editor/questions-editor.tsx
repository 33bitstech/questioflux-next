'use client'
import { useTranslations } from 'next-intl'
import { ArrowDown, ArrowUp, Plus, Trash2, Wand2, X } from 'lucide-react'
import { IChoiceQuestion, IScoredRange } from '@/interfaces/IExperience'
import { blankAnswer, blankQuestion, blankRange, EXPERIENCE_LIMITS, scoredBounds, suggestRanges } from '@/utils/experiences'
import NumberField from './number-field'
import styles from '../experiences.module.scss'

interface IQuestionsProps {
    kind: 'compatibility' | 'scored'
    questions: IChoiceQuestion[]
    onChange: (questions: IChoiceQuestion[]) => void
    flagged: Set<string>
    disabled?: boolean
}

// Perguntas da compatibilidade (sem resposta certa) e da pontuação (cada alternativa vale pontos)
export function QuestionsEditor({ kind, questions, onChange, flagged, disabled }: IQuestionsProps) {
    const t = useTranslations('experienceEditor.questions')
    const withPoints = kind === 'scored'
    const max = withPoints ? EXPERIENCE_LIMITS.scoredMaxQuestions : EXPERIENCE_LIMITS.compatibilityMaxQuestions

    const update = (questionId: string, change: (question: IChoiceQuestion) => IChoiceQuestion) =>
        onChange(questions.map(question => (question.questionId === questionId ? change(question) : question)))

    const move = (index: number, offset: number) => {
        const next = [...questions]
        const [item] = next.splice(index, 1)
        next.splice(index + offset, 0, item)
        onChange(next)
    }

    return (
        <div className={styles.section}>
            <h3>{t('title')}</h3>
            <p>{t(`hint.${kind}`)}</p>

            {questions.map((question, index) => {
                const number = index + 1
                const isFlagged = flagged.has(question.questionId) || question.answers.some(answer => flagged.has(answer.answerId))

                return (
                    <div key={question.questionId} className={`${styles.item} ${isFlagged ? styles.item_flagged : ''}`}>
                        <div className={styles.item_header}>
                            <strong>{t('questionLabel', { number })}</strong>
                            <div className={styles.item_tools}>
                                <button type="button" className={styles.icon_button} onClick={() => move(index, -1)} disabled={disabled || index === 0}
                                    aria-label={t('moveUp', { number })} title={t('moveUp', { number })}><ArrowUp aria-hidden="true" /></button>
                                <button type="button" className={styles.icon_button} onClick={() => move(index, 1)} disabled={disabled || index === questions.length - 1}
                                    aria-label={t('moveDown', { number })} title={t('moveDown', { number })}><ArrowDown aria-hidden="true" /></button>
                                <button type="button" className={styles.icon_button} onClick={() => onChange(questions.filter(item => item.questionId !== question.questionId))}
                                    disabled={disabled || questions.length <= 1} aria-label={t('removeQuestion', { number })} title={t('removeQuestion', { number })}>
                                    <Trash2 aria-hidden="true" />
                                </button>
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor={`question-${question.questionId}`}>{t('questionText')}</label>
                            <input id={`question-${question.questionId}`} type="text" value={question.question} maxLength={EXPERIENCE_LIMITS.questionText}
                                placeholder={t(`questionPlaceholder.${kind}`)} disabled={disabled}
                                onChange={event => update(question.questionId, current => ({ ...current, question: event.target.value }))} />
                        </div>

                        {question.answers.map((answer, answerIndex) => {
                            const answerNumber = answerIndex + 1
                            return (
                                <div key={answer.answerId} className={`${styles.answer_row} ${withPoints ? styles.answer_row_points : ''} ${flagged.has(answer.answerId) ? styles.item_flagged : ''}`}>
                                    <div className={styles.field}>
                                        <label htmlFor={`answer-${answer.answerId}`}>{t('answerLabel', { number: answerNumber })}</label>
                                        <input id={`answer-${answer.answerId}`} type="text" value={answer.text} maxLength={EXPERIENCE_LIMITS.answerText}
                                            placeholder={t('answerPlaceholder', { number: answerNumber })} disabled={disabled}
                                            onChange={event => update(question.questionId, current => ({
                                                ...current,
                                                answers: current.answers.map(item => (item.answerId === answer.answerId ? { ...item, text: event.target.value } : item)),
                                            }))} />
                                    </div>
                                    {withPoints && (
                                        <div className={styles.field}>
                                            <label htmlFor={`points-${answer.answerId}`}>{t('pointsLabel')}</label>
                                            <NumberField id={`points-${answer.answerId}`} value={answer.points ?? 0} min={-EXPERIENCE_LIMITS.maxPoints} max={EXPERIENCE_LIMITS.maxPoints}
                                                onChange={points => update(question.questionId, current => ({
                                                    ...current,
                                                    answers: current.answers.map(item => (item.answerId === answer.answerId ? { ...item, points } : item)),
                                                }))} />
                                        </div>
                                    )}
                                    <button type="button" className={styles.icon_button} disabled={disabled || question.answers.length <= 2}
                                        aria-label={t('removeAnswer', { number: answerNumber })} title={t('removeAnswer', { number: answerNumber })}
                                        onClick={() => update(question.questionId, current => ({ ...current, answers: current.answers.filter(item => item.answerId !== answer.answerId) }))}>
                                        <X aria-hidden="true" />
                                    </button>
                                </div>
                            )
                        })}

                        <button type="button" className={styles.add_button} disabled={disabled || question.answers.length >= EXPERIENCE_LIMITS.maxAnswers}
                            onClick={() => update(question.questionId, current => ({ ...current, answers: [...current.answers, blankAnswer(withPoints ? 0 : undefined)] }))}>
                            <Plus aria-hidden="true" /> {t('addAnswer')}
                        </button>
                    </div>
                )
            })}

            <button type="button" className={styles.add_button} onClick={() => onChange([...questions, blankQuestion(withPoints)])} disabled={disabled || questions.length >= max}>
                <Plus aria-hidden="true" /> {t('addQuestion')}
            </button>
            {questions.length >= max && <p className={styles.hint}>{t('limit', { max })}</p>}
        </div>
    )
}

interface IRangesProps {
    questions: IChoiceQuestion[]
    ranges: IScoredRange[]
    onChange: (ranges: IScoredRange[]) => void
    flagged: Set<string>
    disabled?: boolean
}

const MAX_TOTAL = 4000

// Faixas da pontuação: cada total possível precisa cair em exatamente uma
export function RangesEditor({ questions, ranges, onChange, flagged, disabled }: IRangesProps) {
    const t = useTranslations('experienceEditor.ranges')
    const bounds = scoredBounds(questions)

    const update = (rangeId: string, change: Partial<IScoredRange>) =>
        onChange(ranges.map(range => (range.rangeId === rangeId ? { ...range, ...change } : range)))

    const add = () => {
        const top = ranges.reduce((highest, range) => Math.max(highest, range.max), bounds ? bounds.min - 1 : -1)
        onChange([...ranges, blankRange(top + 1, Math.max(top + 1, bounds?.max ?? top + 1))])
    }

    return (
        <div className={styles.section}>
            <h3>{t('title')}</h3>
            <p>{t('hint')}</p>

            <div className={styles.bounds}>
                <span>{bounds ? t('bounds', { min: bounds.min, max: bounds.max }) : t('noBounds')}</span>
                {bounds && (
                    <button type="button" className={styles.button_link} onClick={() => onChange(suggestRanges(ranges, bounds))} disabled={disabled || !ranges.length}>
                        <Wand2 aria-hidden="true" /> {t('suggest')}
                    </button>
                )}
            </div>

            {ranges.map((range, index) => {
                const number = index + 1
                return (
                    <div key={range.rangeId} className={`${styles.item} ${flagged.has(range.rangeId) ? styles.item_flagged : ''}`}>
                        <div className={styles.item_header}>
                            <strong>{t('rangeLabel', { number })}</strong>
                            <button type="button" className={styles.icon_button} onClick={() => onChange(ranges.filter(item => item.rangeId !== range.rangeId))}
                                disabled={disabled || ranges.length <= EXPERIENCE_LIMITS.minRanges} aria-label={t('remove', { number })} title={t('remove', { number })}>
                                <Trash2 aria-hidden="true" />
                            </button>
                        </div>
                        <div className={styles.field_row}>
                            <div className={styles.field}>
                                <label htmlFor={`min-${range.rangeId}`}>{t('minLabel')}</label>
                                <NumberField id={`min-${range.rangeId}`} value={range.min} min={-MAX_TOTAL} max={MAX_TOTAL} onChange={min => update(range.rangeId, { min })} />
                            </div>
                            <div className={styles.field}>
                                <label htmlFor={`max-${range.rangeId}`}>{t('maxLabel')}</label>
                                <NumberField id={`max-${range.rangeId}`} value={range.max} min={-MAX_TOTAL} max={MAX_TOTAL} onChange={max => update(range.rangeId, { max })} />
                            </div>
                        </div>
                        <div className={styles.field}>
                            <label htmlFor={`range-title-${range.rangeId}`}>{t('titleLabel')}</label>
                            <input id={`range-title-${range.rangeId}`} type="text" value={range.title} maxLength={EXPERIENCE_LIMITS.rangeTitle}
                                placeholder={t('titlePlaceholder')} disabled={disabled} onChange={event => update(range.rangeId, { title: event.target.value })} />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor={`range-description-${range.rangeId}`}>{t('descriptionLabel')}</label>
                            <textarea id={`range-description-${range.rangeId}`} value={range.description} maxLength={EXPERIENCE_LIMITS.rangeDescription}
                                placeholder={t('descriptionPlaceholder')} disabled={disabled} onChange={event => update(range.rangeId, { description: event.target.value })} />
                        </div>
                    </div>
                )
            })}

            <button type="button" className={styles.add_button} onClick={add} disabled={disabled || ranges.length >= EXPERIENCE_LIMITS.maxRanges}>
                <Plus aria-hidden="true" /> {t('add')}
            </button>
        </div>
    )
}
