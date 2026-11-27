'use client'
import { useEffect, useRef, useState } from 'react'
import { useFormatter, useLocale, useTranslations } from 'next-intl'
import { AlertTriangle, CircleAlert, CircleCheck, Eye } from 'lucide-react'
import { Link, useRouter } from '@/i18n/navigation'
import {
    IChoiceQuestion, ICompatibilityContent, IExperienceCheck, IExperienceIssue, IScoredContent, IStoryContent, ITournamentContent,
    TExperienceContent,
} from '@/interfaces/IExperience'
import { saveExperience, uploadExperienceImage } from '@/app/[locale]/(quizGroup)/(createQuiz)/create/experiences/actions'
import { editQuiz } from '@/app/[locale]/(quizGroup)/(editQuiz)/quiz/edit/[quizId]/action'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { editableExperience, imageItems, isPaidTournamentSize, updateImageItem } from '@/utils/experiences'
import PaywallDialog, { TPaywallFeature } from '@/components/Pricing/paywall-dialog'
import { verifyUserPremium } from '@/app/[locale]/(quizGroup)/profile/config/actions'
import { checkPremiumState, PremiumRes } from '@/utils/checkPremiumSubs'
import { ExperienceKind } from '@/utils/quizKind'
import { getLocalizedMessage } from '@/utils/getLocalizedMessage'
import { trackEvent } from '@/utils/analytics'
import TournamentEditor from './Editor/tournament-editor'
import StoryEditor from './Editor/story-editor'
import { QuestionsEditor, RangesEditor } from './Editor/questions-editor'
import ImageModeToggle, { TPlusState } from './Editor/image-mode-toggle'
import VisibilityPopup from '../CreatingQuiz/Questions/visibility-popup'
import NavCreatinQuiz from '../CreatingQuiz/nav-creating-quiz'
import LoadingReq from '../Loading/loading-req'
import styles from './experiences.module.scss'

interface IProps {
    quizId: string
    kind: ExperienceKind
    // conteúdo salvo (vazio num quiz novo)
    initial?: unknown
    isPrivate: boolean
    draft: boolean
    mode: 'create' | 'edit'
    // recursos pagos já liberados neste quiz (torneio de 32 ou 64 opções)
    premiumUnlocked?: boolean
}

// 4 MB: as ações do servidor aceitam até 5 MB por envio
const MAX_IMAGE_BYTES = 4 * 1024 * 1024
const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']

// imagens que dependem da assinatura QuestioPlus (o torneio tem imagens para todos)
const usesPlusImages = (kind: ExperienceKind) => kind !== 'tournament'

// Editor dos formatos de experiência. Salvar manda o conteúdo inteiro; o backend devolve o
// conteúdo salvo e o que ainda impede publicar (issues) ou só merece atenção (warnings).
export default function ExperienceEditor({ quizId, kind, initial, isPrivate, draft, mode, premiumUnlocked }: IProps) {
    const t = useTranslations('experienceEditor')
    const locale = useLocale()
    const format = useFormatter()
    const router = useRouter()
    const { setError, setSucess } = useGlobalMessage()

    const [content, setContent] = useState<TExperienceContent>(() => editableExperience(kind, initial))
    const [check, setCheck] = useState<IExperienceCheck>()
    const [dirty, setDirty] = useState(false)
    const [saving, setSaving] = useState(false)
    const [savedAt, setSavedAt] = useState<Date>()
    const [isDraft, setIsDraft] = useState(draft)
    const [showVisibility, setShowVisibility] = useState(false)
    const [unlocked, setUnlocked] = useState(premiumUnlocked === true)
    const [paywall, setPaywall] = useState<TPaywallFeature>()
    // assinatura de quem edita, para as imagens fora do torneio ('unknown' até a conferência)
    const [plus, setPlus] = useState<TPlusState>('unknown')
    // imagens escolhidas (opções, cenas, escolhas, alternativas), enviadas depois de salvar o conteúdo
    const [previews, setPreviews] = useState<Record<string, string>>({})
    const files = useRef<Record<string, File>>({})
    const problemsRef = useRef<HTMLDivElement>(null)

    const change = (next: TExperienceContent) => {
        setContent(next)
        setDirty(true)
    }

    // sair com alterações sem salvar: o navegador pergunta antes
    useEffect(() => {
        if (!dirty) return
        const warn = (event: BeforeUnloadEvent) => { event.preventDefault() }
        window.addEventListener('beforeunload', warn)
        return () => window.removeEventListener('beforeunload', warn)
    }, [dirty])

    // prévias locais liberadas ao sair
    useEffect(() => () => Object.values(previews).forEach(url => URL.revokeObjectURL(url)), [])

    // a assinatura decide se a opção de imagens aparece trancada (o clique confere de novo)
    useEffect(() => {
        if (!usesPlusImages(kind)) return
        verifyUserPremium(false)
            .then(res => { if (!res.err && res.premium) setPlus(checkPremiumState(res as PremiumRes) ? 'yes' : 'no') })
            .catch(() => {})
    }, [kind])

    // Imagens fora do torneio: só com a assinatura. Sem ela, mostra o aviso do QuestioPlus.
    // Confere a cada tentativa enquanto não deu "sim" (a pessoa pode ter assinado em outra aba).
    const ensurePlus = async (): Promise<boolean> => {
        if (plus === 'yes') return true
        try {
            const res = await verifyUserPremium(false)
            if (res.err || !res.premium) {
                setError(res.err || t('tournament.premiumCheckError'))
                return false
            }
            const subscriber = !!checkPremiumState(res as PremiumRes)
            setPlus(subscriber ? 'yes' : 'no')
            if (!subscriber) setPaywall('plusImages')
            return subscriber
        } catch {
            setError(t('tournament.premiumCheckError'))
            return false
        }
    }

    const dropPreview = (itemId: string) => {
        delete files.current[itemId]
        setPreviews(current => {
            if (current[itemId]) URL.revokeObjectURL(current[itemId])
            const { [itemId]: _removed, ...rest } = current
            return rest
        })
    }

    const pickImage = async (itemId: string, file: File) => {
        if (!IMAGE_TYPES.includes(file.type)) return setError(t('tournament.imageType'))
        if (file.size > MAX_IMAGE_BYTES) return setError(t('tournament.imageTooBig', { size: 4 }))
        if (usesPlusImages(kind) && !(await ensurePlus())) return
        dropPreview(itemId)
        files.current[itemId] = file
        setPreviews(current => ({ ...current, [itemId]: URL.createObjectURL(file) }))
        setContent(current => updateImageItem(kind, current, itemId, () => ({ removeImage: undefined })))
        setDirty(true)
    }

    const removeImage = (itemId: string) => {
        if (files.current[itemId]) return dropPreview(itemId)
        change(updateImageItem(kind, content, itemId, () => ({ removeImage: true })))
    }

    const withImages = usesPlusImages(kind) && (content as { withImages?: boolean }).withImages === true

    // "Com imagens" pede a assinatura; voltar para "Só texto" tira as imagens (com confirmação)
    const setImageMode = async (on: boolean) => {
        if (on === withImages) return
        if (on) {
            if (!(await ensurePlus())) return
            setContent(current => ({ ...current, withImages: true }) as TExperienceContent)
            return setDirty(true)
        }
        const hasImages = Object.keys(files.current).length > 0 || [...imageItems(kind, content).values()].some(item => item.image && !item.removeImage)
        if (hasImages && !window.confirm(t('images.confirmOff'))) return
        Object.keys(files.current).forEach(dropPreview)
        change({ ...content, withImages: false } as TExperienceContent)
    }

    // salva o conteúdo e, no torneio, sobe as imagens novas (as opções já existem no servidor)
    const save = async (): Promise<{ ok: boolean, issues: IExperienceIssue[] }> => {
        setSaving(true)
        try {
            let result = await saveExperience(quizId, content)
            if (!result.ok) {
                // torneio de 32 ou 64 opções sem QuestioPlus nem crédito (o saldo pode ter
                // acabado depois da escolha): o aviso do recurso pago explica e leva aos planos
                if (result.error.type === 'premium') {
                    setPaywall('tournament')
                    return { ok: false, issues: [] }
                }
                // imagens sem a assinatura (ela pode ter acabado com o editor aberto)
                if (result.error.type === 'plusImages') {
                    setPlus('no')
                    setPaywall('plusImages')
                    return { ok: false, issues: [] }
                }
                if (result.issues) setCheck({ issues: result.issues, warnings: result.warnings ?? [] })
                setError(getLocalizedMessage(result.error, locale))
                return { ok: false, issues: result.issues ?? [] }
            }

            let saved = editableExperience(kind, result.experience)
            const pending = Object.entries(files.current)

            // o conteúdo voltou a ser só texto: as imagens escolhidas não sobem
            const imagesOn = kind === 'tournament' || (saved as { withImages?: boolean }).withImages === true
            if (pending.length) {
                let uploaded = 0, failed = 0, plusMissing = false
                const items = imageItems(kind, saved)
                for (const [itemId, file] of pending) {
                    if (!imagesOn || !items.has(itemId)) { dropPreview(itemId); continue }

                    const formData = new FormData()
                    formData.append('quizImg', file)
                    const upload = await uploadExperienceImage(quizId, itemId, formData)
                    if (!upload.ok) {
                        if (upload.error.type === 'plusImages') plusMissing = true
                        failed++
                        continue
                    }

                    uploaded++
                    saved = updateImageItem(kind, saved, itemId, () => ({ image: upload.image }))
                    dropPreview(itemId)
                }
                if (plusMissing) {
                    setPlus('no')
                    setPaywall('plusImages')
                } else if (failed) setError(t('imageError'))
                // o item só com imagem estava "vazio" na conferência anterior: confere de novo
                if (uploaded) {
                    const again = await saveExperience(quizId, saved)
                    if (again.ok) {
                        result = again
                        saved = editableExperience(kind, again.experience)
                    }
                }
            }

            // o backend só aceita 32 ou 64 opções com acesso, e aí marca o torneio como liberado
            if (kind === 'tournament' && isPaidTournamentSize((saved as ITournamentContent).size)) setUnlocked(true)
            setContent(saved)
            setCheck({ issues: result.issues, warnings: result.warnings })
            setSavedAt(new Date())
            setDirty(Object.keys(files.current).length > 0)
            return { ok: true, issues: result.issues }
        } finally {
            setSaving(false)
        }
    }

    const finish = async (makePublic: boolean) => {
        setSaving(true)
        try {
            const formData = new FormData()
            formData.append('quizDatas', JSON.stringify({ quizData: { draft: false, ...(makePublic ? { isPrivate: false } : {}) } }))
            const result = await editQuiz(formData, quizId)
            if (!result.ok) return setError(getLocalizedMessage(result.error, locale) || t('publishError'))

            trackEvent('quiz_create_complete', {
                quiz_id: quizId,
                quiz_kind: kind,
                visibility: makePublic || !isPrivate ? 'public' : 'private',
            })
            setIsDraft(false)
            router.push(`/create/quiz/completed/${quizId}`)
        } finally {
            setSaving(false)
        }
    }

    const publish = async () => {
        const result = await save()
        if (!result.ok) return
        if (result.issues.length) {
            setError(t('fixBeforePublish'))
            problemsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            return
        }
        // já publicado: salvar basta, quem joga já vê a versão nova
        if (!isDraft) return setSucess(t('savedPublished'))
        if (isPrivate) return setShowVisibility(true)
        await finish(false)
    }

    const saveDraft = async () => {
        const result = await save()
        if (result.ok) setSucess(t('saved'))
    }

    // nome do item de cada problema ("Opção 3", "Cena 2, escolha 1", "Faixa 2")
    const itemName = (itemId?: string): string => {
        if (!itemId) return ''
        if (kind === 'tournament') {
            const index = (content as ITournamentContent).options.findIndex(option => option.optionId === itemId)
            return index >= 0 ? t('labels.option', { number: index + 1 }) : ''
        }
        if (kind === 'story') {
            const scenes = (content as IStoryContent).scenes
            const sceneIndex = scenes.findIndex(scene => scene.sceneId === itemId)
            if (sceneIndex >= 0) return t('labels.scene', { number: sceneIndex + 1 })
            for (const [index, scene] of scenes.entries()) {
                const choice = scene.choices.findIndex(item => item.choiceId === itemId)
                if (choice >= 0) return t('labels.choice', { scene: index + 1, number: choice + 1 })
            }
            return ''
        }
        const questions: IChoiceQuestion[] = (content as ICompatibilityContent).questions
        const questionIndex = questions.findIndex(question => question.questionId === itemId)
        if (questionIndex >= 0) return t('labels.question', { number: questionIndex + 1 })
        for (const [index, question] of questions.entries()) {
            const answer = question.answers.findIndex(item => item.answerId === itemId)
            if (answer >= 0) return t('labels.answer', { question: index + 1, number: answer + 1 })
        }
        if (kind === 'scored') {
            const rangeIndex = (content as IScoredContent).ranges.findIndex(range => range.rangeId === itemId)
            if (rangeIndex >= 0) return t('labels.range', { number: rangeIndex + 1 })
        }
        return ''
    }

    const describe = (issue: IExperienceIssue) => {
        const values = { item: itemName(issue.itemId), value: issue.value ?? 0 }
        // com imagens, o item vazio pode ganhar um texto ou uma imagem
        const code = withImages && t.has(`issues.${issue.code}Image`) ? `${issue.code}Image` : issue.code
        return t.has(`issues.${code}`) ? t(`issues.${code}`, values) : t('issues.unknown')
    }

    const imageProps = { withImages, previews, onPickImage: pickImage, onRemoveImage: removeImage }

    const flagged = new Set((check?.issues ?? []).map(issue => issue.itemId).filter((id): id is string => !!id))

    return (
        <div className={styles.editor}>
            {saving && <LoadingReq loading={saving} />}
            {showVisibility && (
                <VisibilityPopup
                    onChoose={makePublic => { setShowVisibility(false); void finish(makePublic) }}
                    onClose={() => setShowVisibility(false)}
                />
            )}

            {mode === 'create' && <NavCreatinQuiz quizId={quizId} isBacking={true} locale={locale} kind={kind} />}

            <div className={styles.editor_intro}>
                <h2>{t(`title.${kind}`)}</h2>
                <p>{t(`intro.${kind}`)}</p>
            </div>

            {kind === 'tournament' && (
                <TournamentEditor content={content as ITournamentContent} onChange={change} flagged={flagged}
                    previews={previews} onPickImage={pickImage} onRemoveImage={removeImage}
                    unlocked={unlocked} onLocked={() => setPaywall('tournament')} disabled={saving} />
            )}
            {paywall && <PaywallDialog feature={paywall} onClose={() => setPaywall(undefined)} />}
            {usesPlusImages(kind) && (
                <ImageModeToggle kind={kind} enabled={withImages} plus={plus} onChange={setImageMode} disabled={saving} />
            )}
            {kind === 'story' && <StoryEditor content={content as IStoryContent} onChange={change} flagged={flagged} disabled={saving} {...imageProps} />}
            {(kind === 'compatibility' || kind === 'scored') && (
                <QuestionsEditor kind={kind} questions={(content as ICompatibilityContent).questions} flagged={flagged} disabled={saving} {...imageProps}
                    onChange={questions => change({ ...content, questions } as TExperienceContent)} />
            )}
            {kind === 'scored' && (
                <RangesEditor questions={(content as IScoredContent).questions} ranges={(content as IScoredContent).ranges} flagged={flagged} disabled={saving}
                    onChange={ranges => change({ ...(content as IScoredContent), ranges })} />
            )}

            <div ref={problemsRef}>
                {check && check.issues.length > 0 && (
                    <div className={`${styles.problems} ${styles.problems_issues}`} role="alert">
                        <h3><CircleAlert aria-hidden="true" /> {t('problems.issuesTitle')}</h3>
                        <ul>{check.issues.map((issue, index) => <li key={`${issue.code}-${issue.itemId ?? index}`}>{describe(issue)}</li>)}</ul>
                    </div>
                )}
                {check && check.warnings.length > 0 && (
                    <div className={`${styles.problems} ${styles.problems_warnings}`}>
                        <h3><AlertTriangle aria-hidden="true" /> {t('problems.warningsTitle')}</h3>
                        <ul>{check.warnings.map((issue, index) => <li key={`${issue.code}-${issue.itemId ?? index}`}>{describe(issue)}</li>)}</ul>
                    </div>
                )}
                {check && check.issues.length === 0 && (
                    <div className={`${styles.problems} ${styles.problems_ok}`}>
                        <h3><CircleCheck aria-hidden="true" /> {t('problems.okTitle')}</h3>
                        <p className={styles.hint}>{isDraft ? t('problems.okDraft') : t('problems.okPublished')}</p>
                    </div>
                )}
            </div>

            {isDraft && <p className={styles.hint}>{t('visibilityNote')}</p>}

            <div className={styles.editor_footer}>
                <span className={styles.saved_note} aria-live="polite">
                    {saving ? t('saving') : dirty ? t('unsaved') : savedAt ? t('savedAt', { time: format.dateTime(savedAt, { timeStyle: 'short' }) }) : ''}
                </span>
                <div>
                    {isDraft ? (
                        <>
                            <button type="button" className={styles.button_secondary} onClick={saveDraft} disabled={saving}>{t('saveDraft')}</button>
                            <button type="button" className={styles.button_primary} onClick={publish} disabled={saving}>{t('publish')}</button>
                        </>
                    ) : (
                        <>
                            <Link href={`/quiz/${quizId}`} className={styles.button_secondary}><Eye aria-hidden="true" /> {t('viewQuiz')}</Link>
                            <button type="button" className={styles.button_primary} onClick={publish} disabled={saving}>{t('saveChanges')}</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
