'use client'

import DefaultProfileImg from '@/components/Icons/profile-icons/DefaultProfileImg'
import { useUser } from '@/contexts/userContext'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

interface IProps{
    styles: Record<string, string>
}

export default function ImgProfileConfig({styles}: IProps) {
    const {user} = useUser(), 
        [imageError, setImageError] = useState<boolean>(false)

    useEffect(() => {
        setImageError(false);
    }, [user?.profileImg]);
    
    return (
        <span className={styles.profile_image_span}>
            {user && user.profileImg && user.profileImg !== 'default' && !imageError ? (
                <Image
                    loading='lazy'
                    src={user.profileImg}
                    alt="Foto de perfil"
                    onError={() => setImageError(true)}
                    width={500}
                    height={500}
                />
            ) : (
                <DefaultProfileImg />
            )}
        </span>
    )
}
