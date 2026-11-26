'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ImagePlus, Sparkles, Trash2, X } from 'lucide-react'
import { ITournamentContent, ITournamentOption } from '@/interfaces/IExperience'
import { blankOption, EXPERIENCE_LIMITS, isPaidTournamentSize, TOURNAMENT_SIZES, TTournamentSize } from '@/utils/experiences'
import { verifyUserPremium } from '@/app/[locale]/(quizGroup)/profile/config/actions'
import { checkPremiumState, PremiumRes } from '@/utils/checkPremiumSubs'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import styles from '../experiences.module.scss'

// opção no editor: a imagem nova fica no navegador até o conteúdo ser salvo
export type TEditorOption = ITournamentOption & { removeImage?: boolean }

interface IProps {
    content: ITournamentContent
    onChange: (content: ITournamentContent) => void
    flagged: Set<string>
    // prévia das imagens escolhidas e ainda não enviadas, por opção
    previews: Record<string, string>
    onPickImage: (optionId: string, file: File) => void
    onRemoveImage: (optionId: string) => void
    // o torneio já foi liberado (QuestioPlus ou crédito do passe usado nele): 32 e 64 opções
    // continuam valendo mesmo sem assinatura nem saldo
    unlocked: boolean
    // 32 ou 64 opções sem QuestioPlus nem crédito: quem chamou mostra o aviso do recurso pago
    onLocked: () => void
    disabled?: boolean
}

const hasContent = (option: TEditorOption) => !!option.text.trim() || (!!option.image && !option.removeImage)

export default function TournamentEditor({ content, onChange, flagged, previews, onPickImage, onRemoveImage, unlocked, onLocked, disabled }: IProps) {
    const t = useTranslations('experienceEditor.tournament')
    const { setError } = useGlobalMessage()
    const options = content.options as TEditorOption[]
    // assinatura e saldo de quem edita, conferidos ao escolher 32 ou 64 opções
    const [access, setAccess] = useState<{ subscriber: boolean, credits: number }>()
    const [checking, setChecking] = useState(false)

    const resize = (size: TTournamentSize) => {
        const removed = options.slice(size)
        if (removed.some(hasContent) && !window.confirm(t('confirmShrink', { size }))) return
        const next = options.slice(0, size)
        while (next.length < size) next.push(blankOption())
        onChange({ size, options: next })
    }

    const setSize = async (size: TTournamentSize) => {
        if (size === content.size || checking) return
        if (!isPaidTournamentSize(size) || unlocked) return resize(size)

        setChecking(true)
        try {
            const res = await verifyUserPremium(false)
            if (res.err || !res.premium) return setError(res.err || t('premiumCheckError'))
            const current = { subscriber: !!checkPremiumState(res as PremiumRes), credits: Number(res.premium.specialCount) || 0 }
            setAccess(current)
            if (!current.subscriber && !current.credits) return onLocked()
            resize(size)
        } catch {
            setError(t('premiumCheckError'))
        } finally {
            setChecking(false)
        }
    }

    const updateOption = (optionId: string, change: Partial<TEditorOption>) =>
        onChange({ ...content, options: options.map(option => (option.optionId === optionId ? { ...option, ...change } : option)) })

    // ao salvar, o torneio grande gasta um crédito do passe (uma vez só)
    const usesCredit = isPaidTournamentSize(content.size) && !unlocked && !!access && !access.subscriber
    const filled = options.filter(hasContent).length

    return (
        <div className={styles.section}>
            <h3>{t('sizeLabel')}</h3>
            {/* durante a conferência do plano os botões continuam focáveis: o aviso do recurso
                pago devolve o foco ao botão escolhido quando fecha */}
            <div className={styles.segmented} role="group" aria-label={t('sizeLabel')} aria-busy={checking}>
                {TOURNAMENT_SIZES.map(size => (
                    <button
                        key={size}
                        type="button"
                        className={content.size === size ? styles.segmented_active : undefined}
                        aria-pressed={content.size === size}
                        onClick={() => setSize(size)}
                        disabled={disabled}
                    >
                        {t('sizeOption', { size, duels: size - 1 })}
                        {isPaidTournamentSize(size) && !unlocked && (
                            <span className={styles.size_plus}><Sparkles aria-hidden="true" /> {t('plusBadge')}</span>
                        )}
                    </button>
                ))}
            </div>
            {usesCredit
                ? <p className={styles.hint}>{t('creditNote')}</p>
                : !unlocked && <p className={styles.hint}>{t('sizeHint')}</p>}

            <h3>{t('optionsTitle')}</h3>
            <p>{t('optionsHint')}</p>
            <p className={styles.hint}>{t('filledCount', { filled, total: content.size })}</p>

            {/* 32 e 64 opções: duas colunas onde couber, para a lista não ficar enorme */}
            <div className={isPaidTournamentSize(content.size) ? styles.options_grid : styles.options_list}>
                {options.map((option, index) => {
                    const preview = previews[option.optionId]
                    const image = preview ?? (option.removeImage ? undefined : option.image)
                    const label = t('optionLabel', { number: index + 1 })

                    return (
                        <div key={option.optionId} className={`${styles.option_row} ${flagged.has(option.optionId) ? styles.item_flagged : ''}`}>
                            <label className={styles.option_image} title={t('imagePick', { number: index + 1 })}>
                                {image
                                    // eslint-disable-next-line @next/next/no-img-element
                                    ? <img src={image} alt="" />
                                    : <ImagePlus aria-hidden="true" />}
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg, image/webp, image/gif"
                                    aria-label={t('imagePick', { number: index + 1 })}
                                    disabled={disabled}
                                    onChange={event => {
                                        const file = event.target.files?.[0]
                                        if (file) onPickImage(option.optionId, file)
                                        event.target.value = ''
                                    }}
                                />
                            </label>

                            <div className={styles.field}>
                                <label htmlFor={`option-${option.optionId}`}>{label}</label>
                                <input
                                    id={`option-${option.optionId}`}
                                    type="text"
                                    value={option.text}
                                    maxLength={EXPERIENCE_LIMITS.optionText}
                                    placeholder={t('optionPlaceholder')}
                                    disabled={disabled}
                                    onChange={event => updateOption(option.optionId, { text: event.target.value })}
                                />
                            </div>

                            <div className={styles.item_tools}>
                                {image ? (
                                    <button type="button" className={styles.icon_button} onClick={() => onRemoveImage(option.optionId)} aria-label={t('imageRemove', { number: index + 1 })} title={t('imageRemove', { number: index + 1 })} disabled={disabled}>
                                        <X aria-hidden="true" />
                                    </button>
                                ) : (
                                    <button type="button" className={styles.icon_button} onClick={() => updateOption(option.optionId, { text: '' })} aria-label={t('clear', { number: index + 1 })} title={t('clear', { number: index + 1 })} disabled={disabled || !option.text}>
                                        <Trash2 aria-hidden="true" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
