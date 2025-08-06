'use client'
import UploadImageSvg from '@/components/Icons/UploadImageSvg'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { ILocalQuestions } from '@/interfaces/ILocalQuestions'
import { TStyles } from '@/types/stylesType'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { ChangeEvent, useEffect, useState } from 'react'

interface IProps{
    styles: TStyles,
    onQuestionImageChange: (file: File | string) => void,
    onMultipleImageUpload: (files: FileList) => void, 
    question: ILocalQuestions
}

export default function InputTitle({styles, onQuestionImageChange, question, onMultipleImageUpload}:IProps) {
    const [questionDraft, setQuestionDraft] = useState<string>(''),
        {setError} = useGlobalMessage(),
        t = useTranslations('profileUpload')

    const handleImageQuestion = (e:ChangeEvent<HTMLInputElement>) =>{
        const files = e.target.files
        if (!files || files.length == 0) return
        
        if (files.length > 1) {
            onMultipleImageUpload(files);
        } else {
            let image = files[0]
            if (!image.name.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/i)) {
                setError(t('errorInvalidType'))
                return 
            }
            setQuestionDraft(URL.createObjectURL(image))
            onQuestionImageChange(image)
        }
    }
    //in edit
    useEffect(()=>{
        if (question.image) {
            if (typeof question.image === 'string') {
                setQuestionDraft(question.image)
            } else {
                setQuestionDraft(URL.createObjectURL(question.image))
            }
        }
    },[question])

    return (
        <label>
            <input 
                type="file" 
                accept='image/*'
                multiple 
                onChange={handleImageQuestion} 
            />
            <div className={`${styles.image_label_container} ${styles.questionImage}`}>
                {questionDraft && <Image 
                    width={500}
                    height={500}
                    src={questionDraft} 
                    alt="Imagem da questão" />}
                {!questionDraft && <span><UploadImageSvg/></span>}
            </div>
        </label>
    )
}