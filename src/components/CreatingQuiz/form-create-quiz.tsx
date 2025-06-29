'use client'
import { TStyles } from '@/types/stylesType'
import React, { FormEvent, useEffect, useState } from 'react'
import InputImageQuiz from './input-image-quiz'
import InputTextQuiz from './input-text-quiz'
import useErrors, {ErrorsState}from '@/hooks/useErrors'
import { useFilters } from '@/contexts/filtersContext'
import IFinalMessages from '@/interfaces/IFinalMessages'
import InputFinalMessages from './input-final-messages'
import { useRouter } from 'next/navigation'
import { useUser } from '@/contexts/userContext'
import { createQuiz } from '@/app/(quizGroup)/(createQuiz)/create/quiz/cover/actions'
import { useGlobalMessage } from '@/contexts/globalMessageContext'

interface IProps{
    styles: TStyles
}

export default function FormCreateQuiz({styles}:IProps) {
    const {getError, setError} = useErrors(),
        {setError: setGlobalError} = useGlobalMessage(),
        {filters} = useFilters(),
        router = useRouter(),
        {token} = useUser()

    const [imageData, setImageData] = useState<File | null>(null),
        [title, setTitle] = useState<string>(''),
        [desc, setDesc] = useState<string>(''),
        [category, setCategory] = useState<string>(''),
        [tagsString, setTagsString] = useState<string>(''),
        [visibility, setVisibility] = useState<string>(''),
        [idiom, setIdiom] = useState<'PT-BR' | 'EN-US'>('EN-US'),

        [finalMessages, setFinalMessages] = useState<IFinalMessages>(),

        [savingAsDraft, setSavingAsDraft] = useState<boolean>(false),
        [loading, setLoading] = useState<boolean>(false),

        [errorQuiz, setErrorQuiz] = useState<ErrorsState>()

    const sendDatas = ()=>{

        // if(!token) return setCanShowRegister(true)
        if(!token) return

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


        createQuiz(formData, token)
            .then(({res, err, warning})=>{
                if (warning) setGlobalError(warning)
                if(err) {
                    if(err.type == undefined || err.type == null) {
                        setGlobalError(err.message)
                    }else{
                        setErrorQuiz(err.message)
                    }
                }else{
                    if(savingAsDraft) {
                        router.push('/home')
                    }else{
                        // router.push(`/create/quiz/questions/${res.quizId}`)
                        console.log(res)
                        router.push(`/quiz/${res.quizId}`)
                    }
                }
            })
            .finally(()=>{
                setLoading(false)
            }) 
    }
    const handleSubmit = (e:FormEvent)=>{
        e.preventDefault()

        sendDatas()
    },
    handleRegisterAndFinishQuiz = ()=>{
        sendDatas()
    }

    useEffect(()=>{
        if (errorQuiz) {
            setError(errorQuiz.type, errorQuiz.message)
        }
    }, [errorQuiz])

    return (
        <form className={styles.form} onSubmit={handleSubmit}>

            <div className={styles.image_container}>
                <InputImageQuiz
                    onFileChange={setImageData}
                />
            </div>

            <InputTextQuiz
                styles={styles}
                labelFor='title'
                labelValue='Title '
                error={getError('title')}
            >
                <input 
                    type="text" 
                    id="title" 
                    placeholder='Ex: you know everything about football?' 
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}    
                />
            </InputTextQuiz>


            <InputTextQuiz
                labelFor='desc'
                labelValue='Description'
                styles={styles}
                error={getError('description')}
            >
                <textarea 
                    id="desc" 
                    placeholder='Here you write the description of your quiz.'
                    value={desc}
                    onChange={(e)=>setDesc(e.target.value)}
                ></textarea>
            </InputTextQuiz>
            
            <InputTextQuiz
                error={getError('category')}
                styles={styles}
                labelFor='category'
                labelValue='Category'
            >
            
                <select id="category" value={category} onChange={e=>setCategory(e.target.value)}> 
                    <option value="" disabled>Choose a category</option>
                    {filters.map((categorie)=>(
                        <option key={categorie} value={categorie}>{categorie}</option>
                    ))}
                </select>
            </InputTextQuiz>

            <InputTextQuiz
                error={getError('tags')}
                styles={styles}
                labelFor='tags'
                labelValue='Tags'
            >
                <input 
                    id='tags'
                    type="text" 
                    placeholder='Write and use "," to separate tags'
                    value={tagsString}
                    onChange={(e)=>setTagsString(e.target.value)}
                />
            </InputTextQuiz>



            <InputTextQuiz
                styles={styles}
                labelFor='visibility'
                labelValue='Visibility'
            >
                <select 
                    id="visibility" 
                    value={visibility} 
                    onChange={e=>setVisibility(e.target.value)}
                >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>
            </InputTextQuiz>
            <InputTextQuiz
                styles={styles}
                labelFor='lang'
                labelValue='Idiom'
            >
                <select 
                    id="lang" 
                    value={idiom} 
                    onChange={e=>setIdiom(e.target.value as 'PT-BR' | 'EN-US')}
                >
                    <option value='EN-US'>EN-US</option>
                    <option value='PT-BR'>PT-BR</option>
                </select>
            </InputTextQuiz>


            <div className={styles.messages}>
                <label>Appearance of message at the end of the Quiz:</label>
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
                    }}>Back</button>
                </div>
                <div className={styles.save}>
                    <input disabled={loading} type='submit' value='Save as Draft' onClick={()=>setSavingAsDraft(true)}/>
                    <input disabled={loading} type="submit" value="Continue" />
                </div>
            </footer>
        </form>
    )
}
