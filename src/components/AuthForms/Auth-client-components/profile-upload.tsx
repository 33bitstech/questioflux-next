'use client';

import UploadImageSvg from '@/components/Icons/UploadImageSvg';
import { ChangeEvent, useRef, useState } from 'react';
import '@/assets/styles/auth.scss'
import Image from 'next/image';
import { useGlobalMessage } from '@/contexts/globalMessageContext';
import { useTranslations } from 'next-intl'; // 1. Importar o hook

interface ImageUploaderProps {
    onFileChange: (file: File | null) => void; 
}

export default function ProfileUploadComponent({ onFileChange }: ImageUploaderProps) {
    const t = useTranslations('profileUpload'); // 2. Inicializar o hook com o nosso namespace
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
        // 3. Usar a tradução para a mensagem de erro
        if (!image.name.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/i)) {
            setError(t('errorInvalidType')); 
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
                id="image" 
                ref={imageInput} 
                onChange={handleImage} 
                accept='image/*'
            />
            <label htmlFor="image">
                <span>
                    {draftImage ? (
                        <Image 
                            src={draftImage} 
                            // 4. Usar a tradução para o texto 'alt'
                            alt={t('altText')} 
                            quality={10}
                            width={400}
                            height={400}
                        />
                    ) : (
                        <UploadImageSvg />
                    )}
                </span>
                {/* 5. Usar a tradução para a instrução */}
                <p>{t('instruction')}</p>
            </label>
        </>
    );    
}