'use client'
import { useId, useState } from 'react'
import { useTranslations } from 'next-intl'
import { MessageSquarePlus, X } from 'lucide-react'
import styles from './explanation-input.module.scss'

interface IProps {
    value?: string
    correct: boolean
    onChange: (text: string) => void
}

// o backend aceita até 1000 caracteres por explicação
const MAX_LENGTH = 1000

// Explicação opcional de uma alternativa da prova. Fica recolhida até a pessoa pedir,
// para seis alternativas não virarem seis caixas de texto vazias.
export default function ExplanationInput({ value = '', correct, onChange }: IProps) {
    const t = useTranslations('creatingQuiz.questionsForm.explanation')
    const [open, setOpen] = useState(false)
    const id = useId()

    if (!open && !value) {
        return (
            <button type='button' className={styles.add} onClick={() => setOpen(true)}>
                <MessageSquarePlus aria-hidden="true" /> {t('add')}
            </button>
        )
    }

    return (
        <div className={`${styles.field} ${correct ? styles.correct : styles.incorrect}`}>
            <label htmlFor={id} className={styles.sr_only}>{t('add')}</label>
            <textarea
                id={id}
                value={value}
                maxLength={MAX_LENGTH}
                autoFocus={!value}
                placeholder={correct ? t('placeholderCorrect') : t('placeholderIncorrect')}
                onChange={e => onChange(e.target.value)}
            />
            <button
                type='button'
                className={styles.remove}
                aria-label={t('remove')}
                title={t('remove')}
                onClick={() => { onChange(''); setOpen(false) }}
            >
                <X aria-hidden="true" />
            </button>
        </div>
    )
}
