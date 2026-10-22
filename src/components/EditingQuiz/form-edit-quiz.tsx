'use client'
import { TStyles } from '@/types/stylesType'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { getLocalizedMessage } from '@/utils/getLocalizedMessage'
import InputImageQuiz from '../CreatingQuiz/input-image-quiz'
import InputTextQuiz from '../CreatingQuiz/input-text-quiz'
import useErrors, { ErrorsState } from '@/hooks/useErrors'
import { useFilters } from '@/contexts/filtersContext'
import IFinalMessages from '@/interfaces/IFinalMessages'
import InputFinalMessages from '../CreatingQuiz/input-final-messages'
import { useRouter } from '@/i18n/navigation'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { Link } from '@/i18n/navigation'
import IQuizes from '@/interfaces/IQuizes'
import { editQuiz } from '@/app/[locale]/(quizGroup)/(editQuiz)/quiz/edit/[quizId]/action'
import { useLocale, useTranslations } from 'next-intl'
import LoadingReq from '../Loading/loading-req'
import DeleteQuiz from './delete-quiz'
import WarningReset from '../widgets/warning-reset'
import InputKindQuiz from '../CreatingQuiz/input-kind-quiz'
import { getQuizKind, QuizKind, quizKinds } from '@/utils/quizKind'
import InputPersonalityResults from '../CreatingQuiz/input-personality-results'
import { ILocalPersonalityResult, initialResults, resultsSnapshot, toApiResults, toLocalResults } from '@/utils/personalityResults'
import { uploadResultImages } from '../CreatingQuiz/upload-result-images'

interface IProps {
    styles: TStyles,
    quiz: IQuizes | undefined | any
}
type QuizIdiom = 'PT-BR' | 'EN-US' | 'ES-ES'

export default function FormEditQuiz({ styles, quiz }: IProps) {
    const { getError, setError, resetErrors, resetTypeError } = useErrors(),
        { setError: setGlobalError, setSucess } = useGlobalMessage(),
        { filters, getCategoryLabel } = useFilters(),
        router = useRouter()

    const t = useTranslations('editQuizFlow');
    const tShared = useTranslations('createQuizFlow.formComponent');
    const locale = useLocale()

    const [imageData, setImageData] = useState<File | null>(null),
        [title, setTitle] = useState<string>(''),
        [desc, setDesc] = useState<string>(''),
        [category, setCategory] = useState<string>(''),
        [tagsString, setTagsString] = useState<string>(''),
        [visibility, setVisibility] = useState<string>(''),
        [idiom, setIdiom] = useState<QuizIdiom>('EN-US'),
        [kind, setKind] = useState<QuizKind>('quiz'),
        [results, setResults] = useState<ILocalPersonalityResult[]>(initialResults),
        [originalImage, setOriginalImage] = useState<string>(''),
        [finalMessages, setFinalMessages] = useState<IFinalMessages>(),
        [loading, setLoading] = useState<boolean>(false),
        [errorQuiz, setErrorQuiz] = useState<ErrorsState>(),
        [showUnsavedWarning, setShowUnsavedWarning] = useState<boolean>(false),
        [initialSnapshot, setInitialSnapshot] = useState<string | null>(null)

    const getErrorMessageByLocale = (error: ErrorsState) => {
        return getLocalizedMessage(error, locale, t('form.unexpectedError'))
    }

    const isDirty = useMemo(() => {
        if (initialSnapshot === null) return false;

        const currentSnapshot = JSON.stringify({
            title,
            desc,
            category,
            tagsString,
            visibility,
            idiom,
            kind,
            results: kind === 'personality' ? resultsSnapshot(results) : null,
            finalMessages: finalMessages || null
        });

        return currentSnapshot !== initialSnapshot || imageData !== null;
    }, [initialSnapshot, title, desc, category, tagsString, visibility, idiom, kind, results, finalMessages, imageData])

    const hasQuestions = (quiz?.qtdQuestions ?? 0) > 0
    const savedKind = getQuizKind(quiz)
    const lockedKinds: QuizKind[] = !hasQuestions
        ? []
        : savedKind === 'personality'
            ? quizKinds.filter(option => option !== 'personality')
            : ['personality']

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        await saveQuizData()
    }
    const saveQuizData = async () => {
        if (!quiz) return

        setErrorQuiz(undefined)
        setLoading(true)

        try {
            const isPrivate = visibility !== 'public'

            const tags = tagsString
                .split(',')
                .map(tag => tag.trim())
                .filter(Boolean)

            const quizObject = {
                quizData: {
                    title,
                    description: desc,
                    category,
                    tags,
                    isPrivate,
                    draft: false,
                    idiom,
                    kind,
                    resultMessages: finalMessages,
                    ...(kind === 'personality' ? { personalityResults: toApiResults(results) } : {}),
                },
            }

            const formData = new FormData()
            formData.append('quizDatas', JSON.stringify(quizObject))

            if (imageData) {
                formData.append('quizImg', imageData)
            }

            const result = await editQuiz(formData, quiz.quizId)

            if (!result.ok) {
                if (!result.error.type || result.error.type === 'global') {
                    setGlobalError(getErrorMessageByLocale(result.error))
                } else {
                    setErrorQuiz(result.error)
                }
                return
            }

            if (result.warning) {
                setGlobalError(getErrorMessageByLocale(result.warning))
            }

            // as imagens novas dos resultados sobem depois da capa salva
            let savedResults = results
            if (kind === 'personality') {
                if (await uploadResultImages(quiz.quizId, results) > 0) setGlobalError(tShared('personalityResults.imageError'))
                savedResults = results.map(({ file, removeImage, ...rest }) => ({
                    ...rest,
                    image: removeImage ? undefined : rest.image,
                }))
                setResults(savedResults)
                // recarrega o quiz do servidor para trazer as URLs das imagens que acabaram de subir
                router.refresh()
            }

            setSucess(t('form.successMessage'))
            setInitialSnapshot(JSON.stringify({
                title,
                desc,
                category,
                tagsString,
                visibility,
                idiom,
                kind,
                results: kind === 'personality' ? resultsSnapshot(savedResults) : null,
                finalMessages: finalMessages || null
            }))
            setImageData(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (errorQuiz) {
            setError(
                errorQuiz.type,
                getLocalizedMessage(errorQuiz, locale, t('form.unexpectedError'))
            )
            return
        }

        resetErrors()
    }, [errorQuiz, locale, setError, resetErrors, t])

    useEffect(() => {
        if (!quiz?.err && quiz) {
            const initialTitle = quiz.title || '';
            const initialDesc = quiz.description || '';
            const initialCategory = quiz.category || '';
            const initialTags = (quiz.tags ?? []).join(', ');
            const initialVisibility = quiz.isPrivate ? 'private' : 'public';
            const initialIdiom = quiz.idiom || 'EN-US';
            const initialMessages = quiz.resultMessages || null;
            const initialKind = getQuizKind(quiz);
            const initialResultsList = quiz.personalityResults?.length ? toLocalResults(quiz.personalityResults) : initialResults();

            setTitle(initialTitle)
            setDesc(initialDesc)
            setCategory(initialCategory)
            setTagsString(initialTags)
            setVisibility(initialVisibility)
            setIdiom(initialIdiom as QuizIdiom)
            setKind(initialKind)
            setResults(initialResultsList)
            setFinalMessages(initialMessages)
            setOriginalImage(quiz.quizThumbnail || '')

            setInitialSnapshot(JSON.stringify({
                title: initialTitle,
                desc: initialDesc,
                category: initialCategory,
                tagsString: initialTags,
                visibility: initialVisibility,
                idiom: initialIdiom,
                kind: initialKind,
                results: initialKind === 'personality' ? resultsSnapshot(initialResultsList) : null,
                finalMessages: initialMessages
            }))
        }
    }, [quiz])

    return (
        <form className={styles.form} onSubmit={handleSubmit}>

            {showUnsavedWarning && <>
                <WarningReset
                    cancelFunction={() => setShowUnsavedWarning(false)}
                    confirmFunction={() => {
                        setShowUnsavedWarning(false);
                        saveQuizData()
                    }}
                    cancelValue={tShared('buttons.back')}
                    confirmValue={t('form.buttons.saveChanges')}
                    title={t('warningUnsaved.title')}
                    description={t('warningUnsaved.quizDesc')}
                />
                <div className={styles.overlay_warning} />
            </>}


            {loading && <LoadingReq loading={loading} />}

            <div className={styles.image_container}>
                <InputImageQuiz onFileChange={setImageData} originalImage={originalImage} />
            </div>

            <InputKindQuiz
                styles={styles}
                value={kind}
                onChange={setKind}
                // com perguntas criadas não dá para trocar de/para personalidade (as perguntas funcionam diferente)
                disabledKinds={lockedKinds}
            />

            <InputTextQuiz styles={styles} labelFor='title' labelValue={tShared('labels.title')} error={getError('title')}>
                <input type="text" id="title" placeholder={tShared('placeholders.title')} value={title}
                    onChange={(e) => { setTitle(e.target.value); resetTypeError('title') }} />
            </InputTextQuiz>

            <InputTextQuiz labelFor='desc' labelValue={tShared('labels.description')} styles={styles} error={getError('description')}>
                <textarea id="desc" placeholder={tShared('placeholders.description')} value={desc}
                    onChange={(e) => { setDesc(e.target.value); resetTypeError('description') }}></textarea>
            </InputTextQuiz>

            <InputTextQuiz error={getError('category')} styles={styles} labelFor='category' labelValue={tShared('labels.category')}>
                <select
                    id="category"
                    value={category}
                    onChange={e => {
                        setCategory(e.target.value)
                        resetTypeError('category')
                    }}
                >
                    <option value="" disabled>
                        {tShared('selects.chooseCategory')}
                    </option>

                    {filters.map((category) => (
                        <option key={category} value={category}>
                            {getCategoryLabel(category, locale)}
                        </option>
                    ))}
                </select>
            </InputTextQuiz>

            <InputTextQuiz error={getError('tags')} styles={styles} labelFor='tags' labelValue={tShared('labels.tags')}>
                <input id='tags' type="text" placeholder={tShared('placeholders.tags')} value={tagsString}
                    onChange={(e) => setTagsString(e.target.value)} />
            </InputTextQuiz>

            <InputTextQuiz styles={styles} labelFor='visibility' labelValue={tShared('labels.visibility')}>
                <select id="visibility" value={visibility} onChange={e => setVisibility(e.target.value)}>
                    <option value="public">{tShared('selects.public')}</option>
                    <option value="private">{tShared('selects.private')}</option>
                </select>
            </InputTextQuiz>

            <InputTextQuiz styles={styles} labelFor='lang' labelValue={tShared('labels.idiom')}>
                <select
                    id="lang"
                    value={idiom}
                    onChange={e => setIdiom(e.target.value as QuizIdiom)}
                >
                    <option value='EN-US'>{tShared('selects.en')}</option>
                    <option value='PT-BR'>{tShared('selects.pt')}</option>
                    <option value='ES-ES'>{tShared('selects.es')}</option>
                </select>
            </InputTextQuiz>

            {kind === 'personality' ? (
                <InputPersonalityResults
                    value={results}
                    onChange={(newResults) => { setResults(newResults); resetTypeError('personalityResults') }}
                    error={getError('personalityResults')}
                />
            ) : (
                <div className={styles.messages}>
                    <label>{tShared('labels.finalMessages')}</label>
                    <InputFinalMessages styles={styles} messagesChanged={setFinalMessages} finalMessages={finalMessages} />
                </div>
            )}

            <footer className={styles.footer}>
                <div className={styles.actions}>
                    <button type='button' onClick={(e) => { e.preventDefault(); router.back() }}>{tShared('buttons.back')}</button>
                    <DeleteQuiz quizId={quiz?.quizId} />
                </div>
                <div className={styles.save}>
                    {quiz && (
                        <Link
                            href={`/quiz/edit/questions/${quiz?.quizId}`}
                            onClick={(e) => {
                                if (isDirty) {
                                    e.preventDefault();
                                    setShowUnsavedWarning(true);
                                }
                            }}
                        >
                            {t('form.buttons.editQuestions')}
                        </Link>
                    )}
                    <input disabled={loading} type="submit" value={t('form.buttons.saveChanges')} />
                </div>
            </footer>
        </form>
    )
}