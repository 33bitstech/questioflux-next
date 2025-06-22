'use client';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import '@/assets/styles/auth.scss'
import Image from 'next/image';
import { useUser } from '@/contexts/userContext';
import DefaultProfileImg from '../Icons/profile-icons/DefaultProfileImg';
import { TStyles } from '@/types/stylesType';

interface IProps {
    onFileChange: (file: File | null) => void,
    styles: TStyles
}

export default function ProfileImgEdit({ onFileChange,styles }: IProps) {
    const {user} = useUser()

    const imageInput = useRef<HTMLInputElement>(null),
        [draftImage, setDraftImage] = useState<string>(''),
        [imageExist, setImageExist] = useState<boolean>(true)

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

    useEffect(()=>{
        if(user && user.profileImg){
            setDraftImage(user.profileImg)
        }
    },[user])

    return (
        <>
            <input 
                type="file" 
                id="image" 
                ref={imageInput} 
                onChange={handleImage} 
                accept='image/*'
            />
            <label htmlFor="image" className={styles.profile_container}>
                <div className={styles.image_content}>
                    {user 
                        ? (draftImage && imageExist 
                            ? (<Image
                                    src={draftImage} 
                                    alt="draft-image" 
                                    width={400}
                                    height={400}
                                    quality={30}
                                    onError={() => setImageExist(false)}
                                />)
                            : <DefaultProfileImg/>)
                        : <DefaultProfileImg/>
                    }
                </div>
            </label>
        </>
    );    
}