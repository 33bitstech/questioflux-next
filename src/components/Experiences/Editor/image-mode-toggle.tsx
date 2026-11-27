'use client'
import { useTranslations } from 'next-intl'
import { Lock, Sparkles } from 'lucide-react'
import { ExperienceKind } from '@/utils/quizKind'
import styles from '../experiences.module.scss'

// assinatura de quem edita: 'unknown' enquanto a conferência não volta
export type TPlusState = 'unknown' | 'yes' | 'no'

interface IProps {
    kind: ExperienceKind
    enabled: boolean
    plus: TPlusState
    onChange: (on: boolean) => void
    disabled?: boolean
}

// "Só texto" ou "Com imagens" (história: cenas e escolhas; perguntas: alternativas). A opção
// de imagens fica à vista para todos, trancada para quem não assina: o clique abre o aviso
// do QuestioPlus. Para quem assina, o clique já liga.
export default function ImageModeToggle({ kind, enabled, plus, onChange, disabled }: IProps) {
    const t = useTranslations('experienceEditor.images')
    const locked = plus !== 'yes' && !enabled
    const scope = kind === 'story' ? 'story' : 'questions'

    return (
        <div className={styles.image_mode}>
            <h3>{t(`label.${scope}`)}</h3>
            <div className={styles.segmented} role="group" aria-label={t(`label.${scope}`)}>
                <button type="button" className={!enabled ? styles.segmented_active : undefined} aria-pressed={!enabled}
                    onClick={() => onChange(false)} disabled={disabled}>
                    {t('textOnly')}
                </button>
                <button type="button" className={`${enabled ? styles.segmented_active : ''} ${locked ? styles.segmented_locked : ''}`}
                    aria-pressed={enabled} onClick={() => onChange(true)} disabled={disabled}
                    aria-describedby="image-mode-hint">
                    {locked && <Lock aria-hidden="true" />}
                    {t('withImages')}
                    <span className={styles.size_plus}><Sparkles aria-hidden="true" /> {t('plusBadge')}</span>
                </button>
            </div>
            <p id="image-mode-hint" className={styles.hint}>
                {enabled ? t(`hintOn.${scope}`) : locked ? t('hintLocked') : t(`hintOff.${scope}`)}
            </p>
        </div>
    )
}
