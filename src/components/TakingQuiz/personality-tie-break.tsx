'use client'
import { useTranslations } from 'next-intl'
import { Scale } from 'lucide-react'
import { IPersonalityTie } from '@/interfaces/IPersonalityOutcome'
import styles from './personality-tie-break.module.scss'

interface IProps {
    tie: IPersonalityTie
    onChoose: (resultId: string) => void
    disabled?: boolean
}

// Pergunta de desempate do quiz de personalidade: aparece só quando as respostas empatam
// e mostra apenas as alternativas dos resultados empatados, na ordem da capa.
export default function PersonalityTieBreak({ tie, onChoose, disabled }: IProps) {
    const t = useTranslations('takingPage.tieBreak')

    return (
        <>
            <div className={styles.overlay} />
            <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="tie-break-question">
                <span className={styles.eyebrow}><Scale aria-hidden="true" /> {t('eyebrow')}</span>
                <h2 id="tie-break-question">{tie.question}</h2>
                <p className={styles.hint}>{t('hint')}</p>

                <div className={styles.options}>
                    {tie.options.map(option => (
                        <button key={option.resultId} type="button" disabled={disabled} onClick={() => onChoose(option.resultId)}>
                            {option.text}
                        </button>
                    ))}
                </div>
            </section>
        </>
    )
}
