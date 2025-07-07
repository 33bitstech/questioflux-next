'use client'
import { useUser } from '@/contexts/userContext';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import DefaultProfileImg from '../Icons/profile-icons/DefaultProfileImg';
import { IUser } from '@/interfaces/IUser';
import IUserLeaderBoardScore from '@/interfaces/IUserLeaderBoardScore';
import IComment from '@/interfaces/IComment';
import IReplies from '@/interfaces/IReplies';
import styles from './user-profile-img-render.module.scss'
import Skeleton from '../Loading/skeleton';

interface IProps{
    width?: number,
    height?: number,
    user: IUser | IUserLeaderBoardScore | IComment | IReplies,
    quality?: number
}

export default function UserProfileImgRender({height=500, width=500, user, quality=50}: IProps) {
    const [imageError, setImageError] = useState<boolean>(false),
        [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setImageError(false);
    }, [user?.profileImg]);


    const hasValidImage = user && user?.profileImg && user.profileImg !== 'default' && !imageError;

    if (!hasValidImage) {
        return <DefaultProfileImg />;
    }


    return (
        <>
            {isLoading && <Skeleton/>}
            <Image
                className={isLoading ? styles.image_loading : styles.image_loaded}
                src={user.profileImg!}
                alt="Foto de perfil"
                onError={() => {
                    setIsLoading(false);
                    setImageError(true);
                }}
                onLoad={() => {
                    setIsLoading(false);
                }}
                width={width}
                height={height}
                quality={quality}
            />

        </>
    )
}