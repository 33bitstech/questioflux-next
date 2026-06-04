'use client'
import { TStyles } from '@/types/stylesType'
import React, { FormEvent, useEffect, useState } from 'react'
import InputImageQuiz from './input-image-quiz'
import InputTextQuiz from './input-text-quiz'
import useErrors, { ErrorsState } from '@/hooks/useErrors'
import { useFilters } from '@/contexts/filtersContext'
import IFinalMessages from '@/interfaces/IFinalMessages'
import InputFinalMessages from './input-final-messages'
import { useRouter } from '@/i18n/navigation'
import { useUser } from '@/contexts/userContext'
import { createQuiz } from '@/app/[locale]/(quizGroup)/(createQuiz)/create/quiz/cover/actions'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { useLocale, useTranslations } from 'next-intl'
import RegisterComponent from '../AuthForms/register-component'
import usePopupAuth from '@/hooks/usePopupAuth'
import LoginComponent from '../AuthForms/login-component'
import LoadingReq from '../Loading/loading-req'
import { getAppLocale } from '@/utils/locale'
import { getLocalizedMessage } from '@/utils/getLocalizedMessage'

interface IProps {
    styles: TStyles
}
type QuizIdiom = 'PT-BR' | 'EN-US' | 'ES-ES'

const getDefaultQuizIdiom = (locale: string): QuizIdiom => {
    const idiomByLocale = {
        pt: 'PT-BR',
        en: 'EN-US',
        es: 'ES-ES',
    } satisfies Record<string, QuizIdiom>

    return idiomByLocale[getAppLocale(locale)]
}

export default function FormCreateQuiz({ styles }: IProps) {
    const t = useTranslations('createQuizFlow.formComponent')
    const locale = useLocale()
    const { getError, setError, resetErrors, resetTypeError } = useErrors(),
        { setError: setGlobalError } = useGlobalMessage(),
        { filters, getCategoryLabel  } = useFilters(),
        router = useRouter(),
        { user, fetchUser } = useUser()

    const [imageData, setImageData] = useState<File | null>(null),
        [title, setTitle] = useState<string>(''),
        [desc, setDesc] = useState<string>(''),
        [category, setCategory] = useState<string>(''),
        [tagsString, setTagsString] = useState<string>(''),
        [visibility, setVisibility] = useState<'public' | 'private'>('private'),
        [idiom, setIdiom] = useState<QuizIdiom>(getDefaultQuizIdiom(locale)),
        [finalMessages, setFinalMessages] = useState<IFinalMessages>(),
        [loading, setLoading] = useState<boolean>(false),
        [errorQuiz, setErrorQuiz] = useState<ErrorsState>(),
        [canShowRegister, setCanShowRegister] = useState<boolean>(false),
        { typePopup, toLogin, toRegister } = usePopupAuth()

    useEffect(() => {
        if (errorQuiz) {
            setError(
                errorQuiz.type,
                getLocalizedMessage(errorQuiz, locale)
            )
            return
        }

        resetErrors()
    }, [errorQuiz, locale, setError, resetErrors])

    const getErrorMessageByLocale = (error: ErrorsState) => {
        return getLocalizedMessage(error, locale)
    }

    const sendDatas = async (saveAsDraft: boolean) => {
        if (!user) return

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
                    draft: true,
                    idiom,
                    resultMessages: finalMessages,
                },
            }

            const formData = new FormData()
            formData.append('quizDatas', JSON.stringify(quizObject))

            if (imageData) {
                formData.append('quizImg', imageData)
            }

            const result = await createQuiz(formData)

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

            if (saveAsDraft) {
                router.push('/home')
                return
            }

            router.push(`/create/quiz/questions/${result.data.quizId}`)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!user) {
            setCanShowRegister(true)
            return
        }

        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLInputElement | null
        const intent = submitter?.value

        await sendDatas(intent === 'draft')
    }

    const handleRegisterAndFinishQuiz = async () => {
        setCanShowRegister(false)
        await fetchUser()
        await sendDatas(false)
    }

    return (
        <>
            {!user && canShowRegister && (<div>
                {typePopup === 'register' && <RegisterComponent
                    locale={locale} absolute={true} toLogin={toLogin}
                    handleRegisterAndFinishQuiz={handleRegisterAndFinishQuiz}
                    show_pop_up={setCanShowRegister}
                />}
                {typePopup === 'login' && <LoginComponent
                    locale={locale} toRegister={toRegister}
                    handleRegisterAndFinishQuiz={handleRegisterAndFinishQuiz}
                    show_pop_up={setCanShowRegister}
                />}
            </div>)}

            {loading && <LoadingReq loading={loading} />}

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.image_container}>
                    <InputImageQuiz onFileChange={setImageData} />
                </div>

                <InputTextQuiz styles={styles} labelFor='title' labelValue={t('labels.title')} error={getError('title')}>
                    <input type="text" id="title" placeholder={t('placeholders.title')} value={title}
                        onChange={(e) => { setTitle(e.target.value); resetTypeError('title') }} />
                </InputTextQuiz>

                <InputTextQuiz labelFor='desc' labelValue={t('labels.description')} styles={styles} error={getError('description')}>
                    <textarea id="desc" placeholder={t('placeholders.description')} value={desc}
                        onChange={(e) => { setDesc(e.target.value); resetTypeError('description') }}></textarea>
                </InputTextQuiz>

                <InputTextQuiz error={getError('category')} styles={styles} labelFor='category' labelValue={t('labels.category')}>
                    <select
                        id="category"
                        value={category}
                        onChange={e => {
                            setCategory(e.target.value)
                            resetTypeError('category')
                        }}
                    >
                        <option value="" disabled>
                            {t('selects.chooseCategory')}
                        </option>

                        {filters.map((category) => (
                            <option key={category} value={category}>
                                {getCategoryLabel(category, locale)}
                            </option>
                        ))}
                    </select>
                </InputTextQuiz>

                <InputTextQuiz error={getError('tags')} styles={styles} labelFor='tags' labelValue={t('labels.tags')}>
                    <input id='tags' type="text" placeholder={t('placeholders.tags')} value={tagsString}
                        onChange={(e) => setTagsString(e.target.value)} />
                </InputTextQuiz>

                <InputTextQuiz styles={styles} labelFor='visibility' labelValue={t('labels.visibility')}>
                    <select id="visibility" value={visibility} onChange={e => setVisibility(e.target.value as 'public' | 'private')}>
                        <option value="public">{t('selects.public')}</option>
                        <option value="private">{t('selects.private')}</option>
                    </select>
                </InputTextQuiz>

                <InputTextQuiz styles={styles} labelFor='lang' labelValue={t('labels.idiom')}>
                    <select
                        id="lang"
                        value={idiom}
                        onChange={e => setIdiom(e.target.value as QuizIdiom)}
                    >
                        <option value='EN-US'>{t('selects.en')}</option>
                        <option value='PT-BR'>{t('selects.pt')}</option>
                        <option value='ES-ES'>{t('selects.es')}</option>
                    </select>
                </InputTextQuiz>

                <div className={styles.messages}>
                    <label>{t('labels.finalMessages')}</label>
                    <InputFinalMessages styles={styles} messagesChanged={setFinalMessages} />
                </div>

                <footer className={styles.footer}>
                    <div className={styles.actions}>
                        <button onClick={(e) => { e.preventDefault(); router.back() }}>{t('buttons.back')}</button>
                    </div>
                    <div className={styles.save}>
                        <button
                            type="submit"
                            name="intent"
                            value="draft"
                            disabled={loading}
                        >
                            {t('buttons.saveDraft')}
                        </button>

                        <button
                            type="submit"
                            name="intent"
                            value="continue"
                            disabled={loading}
                        >
                            {t('buttons.continue')}
                        </button>
                    </div>
                </footer>
            </form>
        </>
    )
}