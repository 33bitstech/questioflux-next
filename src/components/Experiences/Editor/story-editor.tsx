'use client'
import { useTranslations } from 'next-intl'
import { Flag, Play, Plus, Trash2, X } from 'lucide-react'
import { IStoryContent, IStoryScene } from '@/interfaces/IExperience'
import { blankChoice, blankScene, EXPERIENCE_LIMITS } from '@/utils/experiences'
import styles from '../experiences.module.scss'

interface IProps {
    content: IStoryContent
    onChange: (content: IStoryContent) => void
    flagged: Set<string>
    disabled?: boolean
}

const NEW_SCENE = '__new_scene__'
const NEW_ENDING = '__new_ending__'

const blankEnding = (): IStoryScene => ({ ...blankScene(), choices: [], ending: { title: '' } })

const preview = (text: string, size = 42) => (text.length > size ? `${text.slice(0, size - 1)}…` : text)

// História: cenas com até 4 escolhas, cada escolha leva a outra cena; os finais não têm
// escolhas. O backend confere se algum final pode ser alcançado a partir do início.
export default function StoryEditor({ content, onChange, flagged, disabled }: IProps) {
    const t = useTranslations('experienceEditor.story')
    const { scenes } = content
    const full = scenes.length >= EXPERIENCE_LIMITS.maxScenes
    const number = (sceneId: string) => scenes.findIndex(scene => scene.sceneId === sceneId) + 1

    const sceneName = (scene: IStoryScene) => scene.ending
        ? t('endingOption', { number: number(scene.sceneId), title: scene.ending.title ? preview(scene.ending.title) : t('untitled') })
        : t('sceneOption', { number: number(scene.sceneId), text: scene.text ? preview(scene.text) : t('untitled') })

    const updateScene = (sceneId: string, change: (scene: IStoryScene) => IStoryScene) =>
        onChange({ ...content, scenes: scenes.map(scene => (scene.sceneId === sceneId ? change(scene) : scene)) })

    const addScene = (ending: boolean) => {
        if (full) return
        onChange({ ...content, scenes: [...scenes, ending ? blankEnding() : blankScene()] })
    }

    const removeScene = (sceneId: string) => {
        const rest = scenes
            .filter(scene => scene.sceneId !== sceneId)
            // escolhas que levavam à cena apagada ficam sem destino (o editor aponta)
            .map(scene => ({ ...scene, choices: scene.choices.map(choice => (choice.nextSceneId === sceneId ? { ...choice, nextSceneId: '' } : choice)) }))
        if (!rest.length) return
        const startSceneId = content.startSceneId === sceneId ? (rest.find(scene => !scene.ending) ?? rest[0]).sceneId : content.startSceneId
        onChange({ startSceneId, scenes: rest })
    }

    const toggleEnding = (scene: IStoryScene, ending: boolean) => {
        if (ending && scene.choices.some(choice => choice.text || choice.nextSceneId) && !window.confirm(t('confirmEnding'))) return
        updateScene(scene.sceneId, current => ending
            ? { ...current, choices: [], ending: { title: '' } }
            : { sceneId: current.sceneId, text: current.text, choices: [blankChoice(), blankChoice()] })
    }

    // destino novo: cria a cena (ou o final) e já liga a escolha a ela
    const setDestination = (sceneId: string, choiceId: string, value: string) => {
        let created: IStoryScene | undefined
        if (value === NEW_SCENE || value === NEW_ENDING) {
            if (full) return
            created = value === NEW_ENDING ? blankEnding() : blankScene()
        }
        const target = created?.sceneId ?? value
        const next = scenes.map(scene => scene.sceneId !== sceneId ? scene : {
            ...scene,
            choices: scene.choices.map(choice => (choice.choiceId === choiceId ? { ...choice, nextSceneId: target } : choice)),
        })
        onChange({ ...content, scenes: created ? [...next, created] : next })
    }

    return (
        <div className={styles.section}>
            <h3>{t('scenesTitle')}</h3>
            <p>{t('scenesHint')}</p>

            <div className={styles.field}>
                <label htmlFor="story-start">{t('startLabel')}</label>
                <select id="story-start" value={content.startSceneId} disabled={disabled}
                    onChange={event => onChange({ ...content, startSceneId: event.target.value })}>
                    {scenes.filter(scene => !scene.ending).map(scene => (
                        <option key={scene.sceneId} value={scene.sceneId}>{sceneName(scene)}</option>
                    ))}
                </select>
            </div>

            {scenes.map((scene, index) => {
                const isFlagged = flagged.has(scene.sceneId) || scene.choices.some(choice => flagged.has(choice.choiceId))
                const sceneNumber = index + 1

                return (
                    <div key={scene.sceneId} id={`scene-${scene.sceneId}`} className={`${styles.item} ${isFlagged ? styles.item_flagged : ''}`}>
                        <div className={styles.item_header}>
                            <div className={styles.item_tools}>
                                <strong>{t('sceneLabel', { number: sceneNumber })}</strong>
                                {scene.sceneId === content.startSceneId && <span className={`${styles.badge} ${styles.badge_start}`}><Play aria-hidden="true" /> {t('start')}</span>}
                                {scene.ending && <span className={styles.badge}><Flag aria-hidden="true" /> {t('endingBadge')}</span>}
                            </div>
                            <div className={styles.item_tools}>
                                <label className={styles.toggle}>
                                    <input type="checkbox" checked={!!scene.ending} disabled={disabled || scene.sceneId === content.startSceneId}
                                        onChange={event => toggleEnding(scene, event.target.checked)} />
                                    {t('isEnding')}
                                </label>
                                <button type="button" className={styles.icon_button} onClick={() => removeScene(scene.sceneId)}
                                    disabled={disabled || scenes.length <= 1} aria-label={t('removeScene', { number: sceneNumber })} title={t('removeScene', { number: sceneNumber })}>
                                    <Trash2 aria-hidden="true" />
                                </button>
                            </div>
                        </div>

                        {scene.ending && (
                            <div className={styles.field}>
                                <label htmlFor={`ending-${scene.sceneId}`}>{t('endingTitleLabel')}</label>
                                <input id={`ending-${scene.sceneId}`} type="text" value={scene.ending.title} maxLength={EXPERIENCE_LIMITS.endingTitle}
                                    placeholder={t('endingTitlePlaceholder')} disabled={disabled}
                                    onChange={event => updateScene(scene.sceneId, current => ({ ...current, ending: { title: event.target.value } }))} />
                            </div>
                        )}

                        <div className={styles.field}>
                            <label htmlFor={`text-${scene.sceneId}`}>{scene.ending ? t('endingTextLabel') : t('textLabel')}</label>
                            <textarea id={`text-${scene.sceneId}`} value={scene.text} maxLength={EXPERIENCE_LIMITS.sceneText}
                                placeholder={scene.ending ? t('endingTextPlaceholder') : t('textPlaceholder')} disabled={disabled}
                                onChange={event => updateScene(scene.sceneId, current => ({ ...current, text: event.target.value }))} />
                        </div>

                        {!scene.ending && (
                            <>
                                <span className={styles.hint}>{t('choicesLabel')}</span>
                                {scene.choices.map((choice, choiceIndex) => {
                                    const choiceNumber = choiceIndex + 1
                                    return (
                                        <div key={choice.choiceId} className={`${styles.field_row} ${flagged.has(choice.choiceId) ? styles.item_flagged : ''}`}>
                                            <div className={styles.field}>
                                                <label htmlFor={`choice-${choice.choiceId}`}>{t('choiceLabel', { number: choiceNumber })}</label>
                                                <input id={`choice-${choice.choiceId}`} type="text" value={choice.text} maxLength={EXPERIENCE_LIMITS.choiceText}
                                                    placeholder={t('choicePlaceholder')} disabled={disabled}
                                                    onChange={event => updateScene(scene.sceneId, current => ({
                                                        ...current,
                                                        choices: current.choices.map(item => (item.choiceId === choice.choiceId ? { ...item, text: event.target.value } : item)),
                                                    }))} />
                                            </div>
                                            <div className={styles.answer_row}>
                                                <div className={styles.field}>
                                                    <label htmlFor={`destination-${choice.choiceId}`}>{t('destinationLabel')}</label>
                                                    <select id={`destination-${choice.choiceId}`} value={choice.nextSceneId} disabled={disabled}
                                                        onChange={event => setDestination(scene.sceneId, choice.choiceId, event.target.value)}>
                                                        <option value="">{t('destinationNone')}</option>
                                                        {scenes.filter(item => item.sceneId !== scene.sceneId).map(item => (
                                                            <option key={item.sceneId} value={item.sceneId}>{sceneName(item)}</option>
                                                        ))}
                                                        {!full && <option value={NEW_SCENE}>{t('destinationNew')}</option>}
                                                        {!full && <option value={NEW_ENDING}>{t('destinationNewEnding')}</option>}
                                                    </select>
                                                </div>
                                                <button type="button" className={styles.icon_button} disabled={disabled || scene.choices.length <= 1}
                                                    aria-label={t('removeChoice', { number: choiceNumber })} title={t('removeChoice', { number: choiceNumber })}
                                                    onClick={() => updateScene(scene.sceneId, current => ({ ...current, choices: current.choices.filter(item => item.choiceId !== choice.choiceId) }))}>
                                                    <X aria-hidden="true" />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                                <button type="button" className={styles.add_button} disabled={disabled || scene.choices.length >= EXPERIENCE_LIMITS.maxChoices}
                                    onClick={() => updateScene(scene.sceneId, current => ({ ...current, choices: [...current.choices, blankChoice()] }))}>
                                    <Plus aria-hidden="true" /> {t('addChoice')}
                                </button>
                            </>
                        )}
                    </div>
                )
            })}

            <div className={styles.item_tools}>
                <button type="button" className={styles.add_button} onClick={() => addScene(false)} disabled={disabled || full}>
                    <Plus aria-hidden="true" /> {t('addScene')}
                </button>
                <button type="button" className={styles.add_button} onClick={() => addScene(true)} disabled={disabled || full}>
                    <Flag aria-hidden="true" /> {t('addEnding')}
                </button>
            </div>
            {full && <p className={styles.hint}>{t('limit', { max: EXPERIENCE_LIMITS.maxScenes })}</p>}
        </div>
    )
}
