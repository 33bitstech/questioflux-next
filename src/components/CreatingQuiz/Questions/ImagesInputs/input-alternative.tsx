'use client'
import UploadImageSvg from '@/components/Icons/UploadImageSvg'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { TStyles } from '@/types/stylesType'
import Image from 'next/image'
import React, { ChangeEvent, useState } from 'react'
import { file } from 'zod/v4'

interface IProps{
    styles: TStyles,
    onAlternativeImageChange: (altIndex: number, file: File | string) => void,
    i: number
    alternative: {
        id: string,
        answer?: string,
        thumbnail?: string | File
    }
}

export default function InputAlternative({styles, onAlternativeImageChange, i, alternative}:IProps) {
    const {setError} = useGlobalMessage()

    const handleImageAlternative = (e:ChangeEvent<HTMLInputElement>) =>{
        const files = e.target.files
        if (!files || files.length == 0) return
        
        let image = files[0]
        if (!image.name.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/i)) {
            setError('Invalid file type!')
            return 
        }
        onAlternativeImageChange(i, image)
    }

    return (
        <label>
            <input 
                type="file" 
                accept='image/*' 
                onChange={handleImageAlternative}
            />
            <div className={styles.image_label_containers}>
                {alternative.thumbnail && (
                    (typeof alternative.thumbnail === 'string' && alternative.thumbnail.startsWith('http'))
                    ? <Image 
                        src={alternative.thumbnail} 
                        alt="Question image" 
                        height={200}
                        width={200}
                    />
                    : (alternative.thumbnail instanceof File)
                        ? <Image 
                            src={URL.createObjectURL(alternative.thumbnail)} 
                            alt="Question image" 
                            height={200}
                            width={200}
                        />
                        : null
                )}

                {!alternative.thumbnail && <span><UploadImageSvg/></span>}
            </div>
        </label>
    )
}
