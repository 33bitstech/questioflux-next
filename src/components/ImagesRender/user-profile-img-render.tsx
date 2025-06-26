'use client'
import { useUser } from '@/contexts/userContext';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import DefaultProfileImg from '../Icons/profile-icons/DefaultProfileImg';
import { IUser } from '@/interfaces/IUser';
import IUserLeaderBoardScore from '@/interfaces/IUserLeaderBoardScore';
import IComment from '@/interfaces/IComment';
import IReplies from '@/interfaces/IReplies';

interface IProps{
    width?: number,
    height?: number,
    user: IUser | IUserLeaderBoardScore | IComment | IReplies,
    quality?: number
}

export default function UserProfileImgRender({height=500, width=500, user, quality=50}: IProps) {
    const [imageError, setImageError] = useState<boolean>(false)

    useEffect(() => {
        setImageError(false);
    }, [user?.profileImg]);

    return (
        <>
            {user && user.profileImg && user.profileImg !== 'default' && !imageError ? (
                <Image
                    src={user.profileImg}
                    alt="Foto de perfil"
                    onError={() => setImageError(true)}
                    width={width}
                    height={height}
                    quality={quality}
                />
            ) : (
                <DefaultProfileImg />
            )}

        </>
    )
}