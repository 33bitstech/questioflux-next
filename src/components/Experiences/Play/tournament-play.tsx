'use client'
import { useMemo, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Trophy, Undo2 } from 'lucide-react'
import { ITournamentAnswer, ITournamentOption } from '@/interfaces/IExperience'
import { roundKey, shuffled, tournamentState } from '@/utils/experiences'
import styles from '../experiences.module.scss'

interface IProps {
    options: ITournamentOption[]
    onFinish: (answer: ITournamentAnswer) => void
    disabled?: boolean
}

function OptionContent({ option }: { option?: ITournamentOption }) {
    if (!option) return null
    return (
        <>
            {option.image && <Image src={option.image} alt={option.text} width={480} height={480} sizes="(max-width: 640px) 90vw, 340px" />}
            {option.text && <span>{option.text}</span>}
        </>
    )
}

// Torneio: a cada duelo a pessoa escolhe a opção preferida, até sobrar a campeã. A chave é
// sorteada a cada partida; o servidor confere se cada vencedor estava mesmo no duelo.
export default function TournamentPlay({ options, onFinish, disabled }: IProps) {
    const t = useTranslations('experiencePlay')
    // só no navegador: o componente aparece depois do clique em começar
    const [bracket] = useState(() => shuffled(options.map(option => option.optionId)))
    const [winners, setWinners] = useState<string[]>([])
    const byId = useMemo(() => new Map(options.map(option => [option.optionId, option])), [options])
    const state = tournamentState(bracket, winners)

    const pick = (optionId: string) => {
        if (disabled || !state.duel) return
        const next = [...winners, optionId]
        setWinners(next)
        if (!tournamentState(bracket, next).duel) onFinish({ bracket, winners: next })
    }

    const undo = () => {
        if (disabled || !winners.length) return
        setWinners(winners.slice(0, -1))
    }

    const progress = state.totalDuels ? Math.round((state.duel ? state.duelNumber - 1 : state.totalDuels) / state.totalDuels * 100) : 0

    return (
        <div className={styles.play}>
            <div className={styles.play_header}>
                <strong>{state.duel ? t(`tournament.rounds.${roundKey(state.duel.roundSize)}`) : t('tournament.done')}</strong>
                <span>{t('tournament.duelOf', { number: state.duelNumber, total: state.totalDuels })}</span>
            </div>
            <div className={styles.progress} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
                <span style={{ width: `${progress}%` }} />
            </div>

            {state.duel ? (
                <>
                    <p className={styles.hint}>{t('tournament.pick')}</p>
                    <div className={styles.duel}>
                        <button type="button" className={styles.duel_option} onClick={() => pick(state.duel!.a)} disabled={disabled}>
                            <OptionContent option={byId.get(state.duel.a)} />
                        </button>
                        <span className={styles.versus} aria-hidden="true">{t('tournament.versus')}</span>
                        <button type="button" className={styles.duel_option} onClick={() => pick(state.duel!.b)} disabled={disabled}>
                            <OptionContent option={byId.get(state.duel.b)} />
                        </button>
                    </div>
                </>
            ) : (
                // campeã escolhida: fica na tela enquanto o resultado é enviado (ou o nome é pedido)
                <div className={styles.ending}>
                    <span className={styles.eyebrow}><Trophy aria-hidden="true" /> {t('tournament.champion')}</span>
                    <h2>{byId.get(state.champion ?? '')?.text}</h2>
                </div>
            )}

            <div className={styles.play_footer}>
                <button type="button" className={styles.button_link} onClick={undo} disabled={disabled || !winners.length}>
                    <Undo2 aria-hidden="true" /> {t('undo')}
                </button>
            </div>
        </div>
    )
}
