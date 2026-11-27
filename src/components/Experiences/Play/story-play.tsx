'use client'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronRight, Flag, RotateCcw } from 'lucide-react'
import { IStoryAnswer, IStoryChoice, IStoryContent, IStoryScene } from '@/interfaces/IExperience'
import { sceneById } from '@/utils/experiences'
import styles from '../experiences.module.scss'

interface IProps {
    content: IStoryContent
    onEnding: (answer: IStoryAnswer, ending: IStoryScene) => void
    disabled?: boolean
}

// mesmo limite do backend: uma partida com mais escolhas que isso é recusada
const MAX_STEPS = 200

// escolhas da cena; com imagem (QuestioPlus), cartões em grade com a legenda embaixo
function ChoiceList({ choices, onChoose, disabled }: { choices: IStoryChoice[], onChoose: (choice: IStoryChoice) => void, disabled?: boolean }) {
    const t = useTranslations('experiencePlay')
    const withImages = choices.some(choice => choice.image)

    return (
        <ul className={withImages ? styles.choices_images : styles.choices}>
            {choices.map((choice, index) => (
                <li key={choice.choiceId}>
                    <button type="button" className={withImages ? styles.choice_card : styles.choice} onClick={() => onChoose(choice)} disabled={disabled}
                        aria-label={withImages ? choice.text || t('imageAnswer', { number: index + 1 }) : undefined}>
                        {withImages ? <>
                            {choice.image
                                // eslint-disable-next-line @next/next/no-img-element
                                ? <img src={choice.image} alt="" loading="lazy" decoding="async" />
                                : <span className={styles.choice_card_blank} aria-hidden="true">{choice.text}</span>}
                            <span className={styles.choice_card_caption}>
                                <ChevronRight aria-hidden="true" />
                                {choice.image && choice.text && <span>{choice.text}</span>}
                            </span>
                        </> : <>
                            <ChevronRight aria-hidden="true" />
                            <span>{choice.text}</span>
                        </>}
                    </button>
                </li>
            ))}
        </ul>
    )
}

// História interativa: cada escolha leva a outra cena, até um dos finais.
export default function StoryPlay({ content, onEnding, disabled }: IProps) {
    const t = useTranslations('experiencePlay')
    const [choices, setChoices] = useState<string[]>([])
    const [sceneId, setSceneId] = useState(content.startSceneId)
    const sceneRef = useRef<HTMLDivElement>(null)
    const scene = sceneById(content, sceneId)
    const moved = useRef(false)

    // cena nova: o foco (e a leitura de tela) vai para o texto dela
    useEffect(() => {
        if (!moved.current) return
        sceneRef.current?.focus({ preventScroll: true })
        sceneRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }, [sceneId])

    const choose = (choice: IStoryChoice) => {
        const next = sceneById(content, choice.nextSceneId)
        if (disabled || !next || choices.length >= MAX_STEPS) return
        const nextChoices = [...choices, choice.choiceId]
        moved.current = true
        setChoices(nextChoices)
        setSceneId(next.sceneId)
        if (next.ending) onEnding({ choices: nextChoices }, next)
    }

    const restart = () => {
        if (disabled) return
        moved.current = true
        setChoices([])
        setSceneId(content.startSceneId)
    }

    if (!scene) return null

    return (
        <div className={styles.play}>
            <div className={styles.play_header}>
                <strong>{scene.ending ? t('story.endingReached') : t('story.step', { number: choices.length + 1 })}</strong>
            </div>

            {scene.ending ? (
                <div className={styles.ending} ref={sceneRef} tabIndex={-1}>
                    <span className={styles.eyebrow}><Flag aria-hidden="true" /> {t('story.ending')}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {scene.image && <img className={styles.scene_image} src={scene.image} alt="" />}
                    <h2>{scene.ending.title}</h2>
                    {scene.text && <p>{scene.text}</p>}
                </div>
            ) : (
                <div className={styles.scene} ref={sceneRef} tabIndex={-1}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {scene.image && <img className={styles.scene_image} src={scene.image} alt="" />}
                    {scene.text && <p>{scene.text}</p>}
                    {choices.length >= MAX_STEPS ? (
                        <p className={styles.notice}>{t('story.tooLong')}</p>
                    ) : (
                        <ChoiceList choices={scene.choices} onChoose={choose} disabled={disabled} />
                    )}
                </div>
            )}

            <div className={styles.play_footer}>
                <button type="button" className={styles.button_link} onClick={restart} disabled={disabled || !choices.length}>
                    <RotateCcw aria-hidden="true" /> {t('restart')}
                </button>
            </div>
        </div>
    )
}
