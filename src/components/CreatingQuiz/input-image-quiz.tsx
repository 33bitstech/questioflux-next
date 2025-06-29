'use client';

import UploadImageSvg from '@/components/Icons/UploadImageSvg';
import { ChangeEvent, useRef, useState } from 'react';
import '@/assets/styles/auth.scss'
import Image from 'next/image';
import { useGlobalMessage } from '@/contexts/globalMessageContext';

interface ImageUploaderProps {
    onFileChange: (file: File | null) => void; 
}

export default function InputImageQuiz({ onFileChange }: ImageUploaderProps) {
    const imageInput = useRef<HTMLInputElement>(null);
    const [draftImage, setDraftImage] = useState<string>('');
    const {setError} = useGlobalMessage()

    const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) {
            onFileChange(null);
            return; 
        }

        const image = files[0];
        if (!image.name.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/i)) {
            setError('Invalid file type!'); 
            onFileChange(null); 
        return;
        }

        setDraftImage(URL.createObjectURL(image));
        onFileChange(image);
    };

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
                            alt="Preview quiz image" 
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