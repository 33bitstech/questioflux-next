'use client'
import { TStyles } from '@/types/stylesType'
import React, { FormEvent, useEffect, useState } from 'react'
import InputImageQuiz from '../CreatingQuiz/input-image-quiz'
import InputTextQuiz from '../CreatingQuiz/input-text-quiz'
import useErrors, {ErrorsState}from '@/hooks/useErrors'
import { useFilters } from '@/contexts/filtersContext'
import IFinalMessages from '@/interfaces/IFinalMessages'
import InputFinalMessages from '../CreatingQuiz/input-final-messages'
import { useRouter } from '@/i18n/navigation'
import { useUser } from '@/contexts/userContext'
import { createQuiz } from '@/app/[locale]/(quizGroup)/(createQuiz)/create/quiz/cover/actions'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import {Link} from '@/i18n/navigation'
import IQuizes from '@/interfaces/IQuizes'
import { editQuiz } from '@/app/[locale]/(quizGroup)/(editQuiz)/quiz/edit/[quizId]/action'
import { useLocale, useTranslations } from 'next-intl'
import LoadingReq from '../Loading/loading-req'

interface IProps{
    styles: TStyles,
    quiz: IQuizes | undefined
}

export default function FormEditQuiz({styles, quiz}:IProps) {
    const {getError, setError} = useErrors(),
        {setError: setGlobalError, setSucess} = useGlobalMessage(),
        {filters, filtersPt} = useFilters(),
        router = useRouter(),
        {token} = useUser()

    const t = useTranslations('editQuizFlow.form');
    const tShared = useTranslations('createQuizFlow.formComponent');
    const locale = useLocale()

    const [imageData, setImageData] = useState<File | null>(null),
        [title, setTitle] = useState<string>(''),
        [desc, setDesc] = useState<string>(''),
        [category, setCategory] = useState<string>(''),
        [tagsString, setTagsString] = useState<string>(''),
        [visibility, setVisibility] = useState<string>(''),
        [idiom, setIdiom] = useState<'PT-BR' | 'EN-US'>('EN-US'),
        [originalImage, setOriginalImage] = useState<string>(''),

        [finalMessages, setFinalMessages] = useState<IFinalMessages>(),

        [loading, setLoading] = useState<boolean>(false),

        [errorQuiz, setErrorQuiz] = useState<ErrorsState>()

    const handleSubmit = (e:FormEvent)=>{
        e.preventDefault()
        if (!token || !quiz) return

        setLoading(true)

        const isPrivate = visibility == 'public' ? false : true,
            tags = tagsString.split(',').map(tag=>tag.trim())
        
        const quizObject = {
            quizData: {
                title,
                description: desc,
                category,
                tags,
                isPrivate,
                draft: false,
                idiom,
                resultMessages: finalMessages
            }
        }
        const formData = new FormData()

        formData.append('quizDatas', JSON.stringify(quizObject))
        if (imageData) formData.append('quizImg', imageData)


        editQuiz(formData, token, quiz.quizId)
            .then(({res, err, warning})=>{
                if (warning) setGlobalError(warning ?? tShared('serverError'))
                if(err) {
                    if(err.type == undefined || err.type == null) {
                        setGlobalError(err.message)
                    }else{
                        setErrorQuiz(err.message)
                    }
                }else{
                    setSucess(t('successMessage'))
                }
            })
            .finally(()=>{
                setLoading(false)
            }) 
    }

    useEffect(()=>{
        if (errorQuiz) {
            setError(errorQuiz.type, errorQuiz.message)
        }
    }, [errorQuiz])

    useEffect(()=>{
        if(quiz){
            setTitle(quiz.title)
            setDesc(quiz.description)
            setCategory(quiz.category)
            setTagsString((quiz.tags ?? []).join(', '))
            setVisibility(quiz.isPrivate ? 'private' : 'public')
            setIdiom(quiz.idiom as "PT-BR" | "EN-US")

            setFinalMessages(quiz.resultMessages)

            setOriginalImage(quiz.quizThumbnail)
        }
    },[quiz])
    return (
        <form className={styles.form} onSubmit={handleSubmit}>

            {loading && <LoadingReq loading={loading}/>}

            <div className={styles.image_container}>
                <InputImageQuiz
                    onFileChange={setImageData}
                    originalImage={originalImage}
                />
            </div>

            <InputTextQuiz
                styles={styles}
                labelFor='title'
                labelValue={tShared('labels.title')}
                error={getError('title')}
            >
                <input 
                    type="text" 
                    id="title" 
                    placeholder={tShared('placeholders.title')}
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}    
                />
            </InputTextQuiz>


            <InputTextQuiz
                labelFor='desc'
                labelValue={tShared('labels.description')}
                styles={styles}
                error={getError('description')}
            >
                <textarea 
                    id="desc" 
                    placeholder={tShared('placeholders.description')}
                    value={desc}
                    onChange={(e)=>setDesc(e.target.value)}
                ></textarea>
            </InputTextQuiz>
            
            <InputTextQuiz
                error={getError('category')}
                styles={styles}
                labelFor='category'
                labelValue={tShared('labels.category')}
            >
                <select id="category" value={category} onChange={e=>setCategory(e.target.value)}> 
                    <option value="" disabled>{tShared('selects.chooseCategory')}</option>
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
                labelValue={tShared('labels.tags')}
            >
                <input 
                    id='tags'
                    type="text" 
                    placeholder={tShared('placeholders.tags')}
                    value={tagsString}
                    onChange={(e)=>setTagsString(e.target.value)}
                />
            </InputTextQuiz>

            <InputTextQuiz
                styles={styles}
                labelFor='visibility'
                labelValue={tShared('labels.visibility')}
            >
                <select 
                    id="visibility" 
                    value={visibility} 
                    onChange={e=>setVisibility(e.target.value)}
                >
                    <option value="public">{tShared('selects.public')}</option>
                    <option value="private">{tShared('selects.private')}</option>
                </select>
            </InputTextQuiz>

            <InputTextQuiz
                styles={styles}
                labelFor='lang'
                labelValue={tShared('labels.idiom')}
            >
                <select 
                    id="lang" 
                    value={idiom} 
                    onChange={e=>setIdiom(e.target.value as 'PT-BR' | 'EN-US')}
                >
                    <option value='EN-US'>{tShared('selects.en')}</option>
                    <option value='PT-BR'>{tShared('selects.pt')}</option>
                </select>
            </InputTextQuiz>

            <div className={styles.messages}>
                <label>{tShared('labels.finalMessages')}</label>
                <InputFinalMessages
                    styles={styles}
                    messagesChanged={setFinalMessages}
                    finalMessages={finalMessages}
                />
            </div>

            <footer className={styles.footer}>
                <div className={styles.actions}>
                    <button onClick={(e)=>{
                        e.preventDefault()
                        router.back()
                    }}>{tShared('buttons.back')}</button>
                </div>
                <div className={styles.save}>
                    {quiz && <Link href={`/quiz/edit/questions/${quiz?.quizId}`}>{t('buttons.editQuestions')}</Link>}
                    <input disabled={loading} type="submit" value={t('buttons.saveChanges')} />
                </div>
            </footer>
        </form>
    )
}
