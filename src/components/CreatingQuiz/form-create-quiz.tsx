'use client'
import { TStyles } from '@/types/stylesType'
import React, { FormEvent, useEffect, useState } from 'react'
import InputImageQuiz from './input-image-quiz'
import InputTextQuiz from './input-text-quiz'
import useErrors, {ErrorsState}from '@/hooks/useErrors'
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
import GuestForm from '../AuthForms/Guest/guest-form'

interface IProps{
    styles: TStyles
}

export default function FormCreateQuiz({styles}:IProps) {
    const t = useTranslations('createQuizFlow.formComponent')
    const locale = useLocale()
    const {getError, setError, resetErrors} = useErrors(),
        {setError: setGlobalError} = useGlobalMessage(),
        {filters, filtersPt} = useFilters(),
        router = useRouter(),
        {token} = useUser()

    const [imageData, setImageData] = useState<File | null>(null),
        [title, setTitle] = useState<string>(''),
        [desc, setDesc] = useState<string>(''),
        [category, setCategory] = useState<string>(''),
        [tagsString, setTagsString] = useState<string>(''),
        [visibility, setVisibility] = useState<string>(''),
        [idiom, setIdiom] = useState<'PT-BR' | 'EN-US'>(locale == 'pt' ? 'PT-BR':'EN-US'),

        [finalMessages, setFinalMessages] = useState<IFinalMessages>(),

        [savingAsDraft, setSavingAsDraft] = useState<boolean>(false),
        [loading, setLoading] = useState<boolean>(false),

        [errorQuiz, setErrorQuiz] = useState<ErrorsState>(),

        [canShowRegister, setCanShowRegister] = useState<boolean>(false),
        {typePopup, toGuest, toLogin, toRegister} = usePopupAuth()

    useEffect(()=>{
        if (errorQuiz) {
            switch (locale) {
                case 'pt':
                    setError(errorQuiz.type, errorQuiz.messagePT)
                    break;
                case 'en':
                    setError(errorQuiz.type, errorQuiz.message)
                    break;
                default:
                    break;
            }
        }else{
            resetErrors()
        }
    }, [errorQuiz])
    

    const sendDatas = (acessToken?: string)=>{
        if(!token && !acessToken) return
        setErrorQuiz(undefined)
        setLoading(true)

        let tempToken = token ? token : `Bearer ${acessToken}`

        const isPrivate = visibility == 'public' ? false : true,
            tags = tagsString.split(',').map(tag=>tag.trim())
        
        const quizObject = {
            quizData: {
                title,
                description: desc,
                category,
                tags,
                isPrivate,
                draft: true,
                idiom,
                resultMessages: finalMessages
            }
        }
        
        const formData = new FormData()

        formData.append('quizDatas', JSON.stringify(quizObject))
        if (imageData) formData.append('quizImg', imageData)

        createQuiz(formData, tempToken)
            .then(({res, err, warning})=>{
                if (warning) setGlobalError(warning ?? t('serverError'))
                if(err) {
                    if(err.type == undefined || err.type == null) {
                        setGlobalError(err.message)
                    }else{
                        setErrorQuiz(err)
                    }
                }else{
                    if(savingAsDraft) {
                        router.push('/home')
                    }else{
                        router.push(`/create/quiz/questions/${res.quizId}`)
                    }
                }
            })
            .finally(()=>{
                setLoading(false)
            }) 
    }
    const handleSubmit = (e:FormEvent)=>{
        e.preventDefault()

        if(!token) return setCanShowRegister(true)

        sendDatas()
    },
    handleRegisterAndFinishQuiz = (token:string)=>{
        setCanShowRegister(false)
        sendDatas(token)
    }

    return (
        <>
            {!token && canShowRegister && (<div>
                {typePopup === 'register' 
                    && <RegisterComponent
                        locale={locale}
                        absolute={true}
                        toLogin={toLogin}
                        toGuest={toGuest}
                        handleRegisterAndFinishQuiz={handleRegisterAndFinishQuiz}
                        show_pop_up={setCanShowRegister}
                    /> 
                }
                {typePopup === 'login' && 
                    <LoginComponent
                        locale={locale}
                        toRegister={toRegister}
                        handleRegisterAndFinishQuiz={handleRegisterAndFinishQuiz}
                        show_pop_up={setCanShowRegister}
                    />
                }
                {typePopup === 'guest' && 
                    <GuestForm
                        toRegister={toRegister}
                        handleRegisterAndFinishQuiz={handleRegisterAndFinishQuiz}
                        show_pop_up={setCanShowRegister}
                    />
                }
            </div>)}

            {loading && <LoadingReq loading={loading}/>}

            <form className={styles.form} onSubmit={handleSubmit}>

                <div className={styles.image_container}>
                    <InputImageQuiz
                        onFileChange={setImageData}
                    />
                </div>

                <InputTextQuiz
                    styles={styles}
                    labelFor='title'
                    labelValue={t('labels.title')}
                    error={getError('title')}
                >
                    <input 
                        type="text" 
                        id="title" 
                        placeholder={t('placeholders.title')} 
                        value={title}
                        onChange={(e)=>setTitle(e.target.value)}    
                    />
                </InputTextQuiz>

                <InputTextQuiz
                    labelFor='desc'
                    labelValue={t('labels.description')}
                    styles={styles}
                    error={getError('description')}
                >
                    <textarea 
                        id="desc" 
                        placeholder={t('placeholders.description')}
                        value={desc}
                        onChange={(e)=>setDesc(e.target.value)}
                    ></textarea>
                </InputTextQuiz>
                
                <InputTextQuiz
                    error={getError('category')}
                    styles={styles}
                    labelFor='category'
                    labelValue={t('labels.category')}
                >
                    <select id="category" value={category} onChange={e=>setCategory(e.target.value)}> 
                        <option value="" disabled>{t('selects.chooseCategory')}</option>
                        {locale == 'pt'
                            ? filtersPt.map((categorie, index)=>(
                                <option key={categorie} value={filters[filtersPt.indexOf(categorie)]}>{categorie}</option>
                            )) 
                            : filters.map((categorie)=>(
                                <option key={categorie} value={categorie}>{categorie}</option>
                            ))
                        }
                    </select>
                </InputTextQuiz>

                <InputTextQuiz
                    error={getError('tags')}
                    styles={styles}
                    labelFor='tags'
                    labelValue={t('labels.tags')}
                >
                    <input 
                        id='tags'
                        type="text" 
                        placeholder={t('placeholders.tags')}
                        value={tagsString}
                        onChange={(e)=>setTagsString(e.target.value)}
                    />
                </InputTextQuiz>

                <InputTextQuiz
                    styles={styles}
                    labelFor='visibility'
                    labelValue={t('labels.visibility')}
                >
                    <select 
                        id="visibility" 
                        value={visibility} 
                        onChange={e=>setVisibility(e.target.value)}
                    >
                        <option value="public">{t('selects.public')}</option>
                        <option value="private">{t('selects.private')}</option>
                    </select>
                </InputTextQuiz>

                <InputTextQuiz
                    styles={styles}
                    labelFor='lang'
                    labelValue={t('labels.idiom')}
                >
                    <select 
                        id="lang" 
                        value={idiom} 
                        onChange={e=>setIdiom(e.target.value as 'PT-BR' | 'EN-US')}
                    >
                        <option value='EN-US'>{t('selects.en')}</option>
                        <option value='PT-BR'>{t('selects.pt')}</option>
                    </select>
                </InputTextQuiz>

                <div className={styles.messages}>
                    <label>{t('labels.finalMessages')}</label>
                    <InputFinalMessages
                        styles={styles}
                        messagesChanged={setFinalMessages}
                    />
                </div>

                <footer className={styles.footer}>
                    <div className={styles.actions}>
                        <button onClick={(e)=>{
                            e.preventDefault()
                            router.back()
                        }}>{t('buttons.back')}</button>
                    </div>
                    <div className={styles.save}>
                        <input disabled={loading} type='submit' value={t('buttons.saveDraft')} onClick={()=>setSavingAsDraft(true)}/>
                        <input disabled={loading} type="submit" value={t('buttons.continue')} />
                    </div>
                </footer>
            </form>
        </>
    )
}
