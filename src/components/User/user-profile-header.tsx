'use client'
import { useUser } from '@/contexts/userContext'
import React from 'react'
import styles from './user-profile-header.module.scss'
import { IUser } from '@/interfaces/IUser'
import UserProfileImgRender from '../ImagesRender/user-profile-img-render'

interface IProps {
    userP?: IUser
}

export default function UserProfileHeader({userP}: IProps) {
    const {user} = useUser()
    console.log(user)
    return (
        <div className={styles.profile_container}>
            <div className={styles.image_container}>
                <div className={styles.image_content}>
                    { (userP || user) && <UserProfileImgRender user={userP || user as IUser}/> }
                </div>
            </div>
            <div className={styles.profile_actions}>
                <div className={styles.Username}>
                    <p>{userP?.name || user?.name || ''}</p>
                </div>
                <div className={styles.badges}></div>
            </div>
        </div>
    )
}
