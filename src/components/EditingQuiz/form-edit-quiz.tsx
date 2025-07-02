'use client'
import { TStyles } from '@/types/stylesType'
import React, { FormEvent, useEffect, useState } from 'react'
import InputImageQuiz from '../CreatingQuiz/input-image-quiz'
import InputTextQuiz from '../CreatingQuiz/input-text-quiz'
import useErrors, {ErrorsState}from '@/hooks/useErrors'
import { useFilters } from '@/contexts/filtersContext'
import IFinalMessages from '@/interfaces/IFinalMessages'
import InputFinalMessages from '../CreatingQuiz/input-final-messages'
import { useRouter } from 'next/navigation'
import { useUser } from '@/contexts/userContext'
import { createQuiz } from '@/app/(quizGroup)/(createQuiz)/create/quiz/cover/actions'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import Link from 'next/link'
import IQuizes from '@/interfaces/IQuizes'
import { editQuiz } from '@/app/(quizGroup)/(editQuiz)/quiz/edit/[quizId]/action'

interface IProps{
    styles: TStyles,
    quiz: IQuizes | undefined
}

export default function FormEditQuiz({styles, quiz}:IProps) {
    const {getError, setError} = useErrors(),
        {setError: setGlobalError, setSucess} = useGlobalMessage(),
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
        [originalImage, setOriginalImage] = useState<string>(''),

        [finalMessages, setFinalMessages] = useState<IFinalMessages>(),

        [loading, setLoading] = useState<boolean>(false),

        [errorQuiz, setErrorQuiz] = useState<ErrorsState>()

    const handleSubmit = (e:FormEvent)=>{
        e.preventDefault()
        if (!token || !quiz) return

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
                if (warning) setGlobalError(warning ?? "Server Error")
                if(err) {
                    if(err.type == undefined || err.type == null) {
                        setGlobalError(err.message)
                    }else{
                        setErrorQuiz(err.message)
                    }
                }else{
                    setSucess('Quiz edited successfully!')
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

            <div className={styles.image_container}>
                <InputImageQuiz
                    onFileChange={setImageData}
                    originalImage={originalImage}
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
                    finalMessages={finalMessages}
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
                    <Link href={`/quiz/edit/questions/${quiz?.quizId}`}>Edit Questions</Link>
                    <input disabled={loading} type="submit" value="Save Changes" />
                </div>
            </footer>
        </form>
    )
}
