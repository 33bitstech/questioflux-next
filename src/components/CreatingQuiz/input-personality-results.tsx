'use client'
import { ChangeEvent, useEffect, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { ImagePlus, Plus, Trash2, X } from 'lucide-react'
import {
    emptyResult, ILocalPersonalityResult, MAX_PERSONALITY_RESULTS, MIN_PERSONALITY_RESULTS, resultColor
} from '@/utils/personalityResults'
import styles from './input-personality-results.module.scss'

interface IProps {
    value: ILocalPersonalityResult[]
    onChange: (results: ILocalPersonalityResult[]) => void
    error?: string | null
    // pergunta feita só quando resultados empatam; cada resultado tem a sua alternativa
    tieBreakQuestion: string
    onTieBreakQuestionChange: (question: string) => void
}

const isValidImage = (file: File) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)

// Prévia da imagem do resultado: a que já está salva ou a escolhida agora.
function ResultImage({ result, alt }: { result: ILocalPersonalityResult, alt: string }) {
    const [preview, setPreview] = useState('')

    useEffect(() => {
        if (result.file) {
            const url = URL.createObjectURL(result.file)
            setPreview(url)
            return () => URL.revokeObjectURL(url)
        }
        setPreview(result.removeImage ? '' : result.image ?? '')
    }, [result.file, result.image, result.removeImage])

    if (!preview) return <ImagePlus aria-hidden="true" />

    return <Image src={preview} alt={alt} width={160} height={160} unoptimized={preview.startsWith('blob:')} />
}

// Capa do quiz de personalidade: os perfis a que as alternativas das perguntas vão levar.
export default function InputPersonalityResults({ value, onChange, error, tieBreakQuestion, onTieBreakQuestionChange }: IProps) {
    const t = useTranslations('createQuizFlow.formComponent.personalityResults')

    const update = (index: number, patch: Partial<ILocalPersonalityResult>) =>
        onChange(value.map((result, i) => i === index ? { ...result, ...patch } : result))

    const handleFile = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        e.target.value = ''
        if (!file || !isValidImage(file)) return
        update(index, { file, removeImage: false })
    }

    const clearImage = (index: number) => update(index, { file: undefined, removeImage: true })

    return (
        <fieldset className={styles.results}>
            <legend>{t('label')}</legend>
            <p className={styles.hint}>{t('hint', { min: MIN_PERSONALITY_RESULTS, max: MAX_PERSONALITY_RESULTS })}</p>

            <ol>
                {value.map((result, index) => {
                    const hasImage = !!result.file || (!!result.image && !result.removeImage)

                    return (
                        <li key={result.resultId} style={{ ['--result-color' as string]: resultColor(index) }}>
                            <div className={styles.result_header}>
                                <span className={styles.badge}>{t('resultNumber', { number: index + 1 })}</span>
                                {value.length > MIN_PERSONALITY_RESULTS && (
                                    <button
                                        type='button'
                                        className={styles.remove}
                                        onClick={() => onChange(value.filter((_, i) => i !== index))}
                                        aria-label={t('remove', { number: index + 1 })}
                                        title={t('remove', { number: index + 1 })}
                                    >
                                        <Trash2 aria-hidden="true" />
                                    </button>
                                )}
                            </div>

                            <div className={styles.result_body}>
                                <div className={styles.image_field}>
                                    <label className={styles.image_picker} title={t('image')}>
                                        <input type='file' accept='image/*' onChange={(e) => handleFile(index, e)} />
                                        <ResultImage result={result} alt={t('imageAlt', { number: index + 1 })} />
                                        <span className={styles.sr_only}>{t('image')}</span>
                                    </label>
                                    {hasImage && (
                                        <button type='button' className={styles.clear_image} onClick={() => clearImage(index)} aria-label={t('removeImage')} title={t('removeImage')}>
                                            <X aria-hidden="true" />
                                        </button>
                                    )}
                                </div>

                                <div className={styles.texts}>
                                    <input
                                        type='text'
                                        maxLength={80}
                                        value={result.title}
                                        aria-label={t('titleLabel', { number: index + 1 })}
                                        placeholder={t('titlePlaceholder')}
                                        onChange={(e) => update(index, { title: e.target.value })}
                                    />
                                    <textarea
                                        maxLength={600}
                                        value={result.description}
                                        aria-label={t('descriptionLabel', { number: index + 1 })}
                                        placeholder={t('descriptionPlaceholder')}
                                        onChange={(e) => update(index, { description: e.target.value })}
                                    />
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ol>

            {value.length < MAX_PERSONALITY_RESULTS && (
                <button type='button' className={styles.add} onClick={() => onChange([...value, emptyResult()])}>
                    <Plus aria-hidden="true" /> {t('add')}
                </button>
            )}

            <div className={styles.tie_break}>
                <label htmlFor='tie-break-question'>{t('tieBreak.title')}</label>
                <p className={styles.hint}>{t('tieBreak.hint')}</p>
                <input
                    id='tie-break-question'
                    type='text'
                    maxLength={220}
                    value={tieBreakQuestion}
                    placeholder={t('tieBreak.questionPlaceholder')}
                    onChange={(e) => onTieBreakQuestionChange(e.target.value)}
                />

                {/* as alternativas só fazem sentido com a pergunta escrita */}
                {tieBreakQuestion.trim() && (
                    <ul>
                        {value.map((result, index) => (
                            <li key={result.resultId} style={{ ['--result-color' as string]: resultColor(index) }}>
                                <span className={styles.badge}>{result.title.trim() || t('resultNumber', { number: index + 1 })}</span>
                                <input
                                    type='text'
                                    maxLength={120}
                                    value={result.tieBreakOption ?? ''}
                                    aria-label={t('tieBreak.optionLabel', { result: result.title.trim() || t('resultNumber', { number: index + 1 }) })}
                                    placeholder={t('tieBreak.optionPlaceholder')}
                                    onChange={(e) => update(index, { tieBreakOption: e.target.value })}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {error && <p className={styles.error}>{error}</p>}
        </fieldset>
    )
}
