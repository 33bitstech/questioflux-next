'use client';

import UploadImageSvg from '@/components/Icons/UploadImageSvg';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import '@/assets/styles/auth.scss'
import Image from 'next/image';
import { useGlobalMessage } from '@/contexts/globalMessageContext';
import { useTranslations } from 'next-intl';

interface ImageUploaderProps {
    onFileChange: (file: File | null) => void; 
    originalImage?: string
}

export default function InputImageQuiz({ onFileChange, originalImage}: ImageUploaderProps) {
    const imageInput = useRef<HTMLInputElement>(null);
    const [draftImage, setDraftImage] = useState<string>('');
    const {setError} = useGlobalMessage()
    const t = useTranslations('creation')

    const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) {
            onFileChange(null);
            return; 
        }

        const image = files[0];
        if (!image.name.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/i)) {
            setError(t('sharedErrors.invalidFileType'))
            onFileChange(null); 
        return;
        }

        setDraftImage(URL.createObjectURL(image));
        onFileChange(image);
    };

    //in edit
    useEffect(()=>{
        if(originalImage && originalImage !== 'default')setDraftImage(originalImage)
    },[originalImage])

    return (
        <>
            <input 
                type="file" 
                id="imageQuiz" 
                ref={imageInput} 
                onChange={handleImage} 
                accept='image/*'
            />
            <label htmlFor="imageQuiz">
                <span>
                    {draftImage ? (
                        <Image 
                            src={draftImage} 
                            alt={t('imageInputs.altQuizPreview')} 
                            quality={100}
                            width={1000}
                            height={1000}
                        />
                    ) : (
                        <UploadImageSvg />
                    )}
                </span>
            </label>
        </>
    );    
}