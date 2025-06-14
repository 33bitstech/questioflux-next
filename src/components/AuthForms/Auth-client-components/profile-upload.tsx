'use client';

import UploadImageSvg from '@/components/Icons/UploadImageSvg';
import { ChangeEvent, useRef, useState } from 'react';
import '@/assets/styles/auth.scss'
import Image from 'next/image';

interface ImageUploaderProps {
    onFileChange: (file: File | null) => void; 
}

export default function ProfileUploadComponent({ onFileChange }: ImageUploaderProps) {
    const imageInput = useRef<HTMLInputElement>(null);
    const [draftImage, setDraftImage] = useState<string>('');

    const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
        //setError('global', '')

        const files = e.target.files;
        if (!files || files.length === 0) {
            onFileChange(null);
            return; 
        }

        const image = files[0];
        if (!image.name.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/i)) {
            //alert('Invalid file type!'); 
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
                        <Image src={draftImage} alt="Preview profile image" quality={100}/>
                    ) : (
                        <UploadImageSvg />
                    )}
                </span>
                <p>Chose your profile picture</p>
            </label>
        </>
    );    
}