'use client'
import { useUser } from '@/contexts/userContext'
import React, { useEffect, useState } from 'react'
import styles from './user-profile-header.module.scss'
import DefaultProfileImg from '../Icons/profile-icons/DefaultProfileImg'
import Image from 'next/image'


export default function UserProfileHeader() {
    const {user} = useUser(),
        [imageError, setImageError] = useState(false)

    useEffect(() => {
        setImageError(false);
    }, [user?.profileImg]);

    return (
        <div className={styles.profile_container}>
            <div className={styles.image_container}>
                <div className={styles.image_content}>
                    {user && user.profileImg && user.profileImg !== 'default' && !imageError ? (
                        <Image
                            src={user.profileImg}
                            alt="Foto de perfil"
                            onError={() => setImageError(true)}
                            width={500}
                            height={500}
                            quality={100}
                        />
                    ) : (
                        <DefaultProfileImg />
                    )}
                </div>
            </div>
            <div className={styles.profile_actions}>
                <div className={styles.Username}>
                    <p>{user?.name || ''}</p>
                </div>
                <div className={styles.badges}></div>
            </div>
        </div>
    )
}
