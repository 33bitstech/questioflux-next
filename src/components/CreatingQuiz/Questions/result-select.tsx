'use client'
import { useId } from 'react'
import { useTranslations } from 'next-intl'
import { IResultOption } from '@/utils/personalityQuestions'
import styles from './result-select.module.scss'

interface IProps {
    value: string
    options: IResultOption[]
    onChange: (resultId: string) => void
}

// Quiz de personalidade: a que resultado esta alternativa leva.
export default function ResultSelect({ value, options, onChange }: IProps) {
    const t = useTranslations('creatingQuiz.questionsForm.personality')
    const id = useId()
    const color = options.find(option => option.resultId === value)?.color

    return (
        <div className={styles.result_select} style={{ ['--result-color' as string]: color ?? 'transparent' }}>
            <label htmlFor={id}>{t('leadsTo')}</label>
            <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
                {options.map(option => (
                    <option key={option.resultId} value={option.resultId}>{option.title}</option>
                ))}
            </select>
        </div>
    )
}
