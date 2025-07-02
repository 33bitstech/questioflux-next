'use client'
import UploadImageSvg from '@/components/Icons/UploadImageSvg'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { TStyles } from '@/types/stylesType'
import Image from 'next/image'
import React, { ChangeEvent, useState } from 'react'

interface IProps{
    styles: TStyles,
    onQuestionImageChange: (file: File | string) => void
}

export default function InputTitle({styles, onQuestionImageChange}:IProps) {
    const [questionDraft, setQuestionDraft] = useState<string>(''),
        {setError} = useGlobalMessage()

    const handleImageQuestion = (e:ChangeEvent<HTMLInputElement>) =>{
        const files = e.target.files
        if (!files || files.length == 0) return
        
        let image = files[0]
        if (!image.name.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/i)) {
            setError('Invalid file type!')
            return 
        }
        setQuestionDraft(URL.createObjectURL(image))
        onQuestionImageChange(image)
    }

    return (
        <label>
            <input 
                type="file" 
                accept='image/*' 
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
