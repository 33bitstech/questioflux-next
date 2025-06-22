import IUserLeaderBoardScore from '@/interfaces/IUserLeaderBoardScore';
import { TStyles } from '@/types/stylesType'
import React, { useState } from 'react'
import DefaultProfileImg from '../Icons/profile-icons/DefaultProfileImg';
import Link from 'next/link';
import CloseSvg from '../Icons/CloseSvg';
import Image from 'next/image';
import styles from './participants-container.module.scss'
import UserProfileImgRender from '../ImagesRender/user-profile-img-render';

interface IProps {
    users: TParticipants,
    closeParticipants: () => void
}
type TParticipants = Array<IUserLeaderBoardScore & {
    name: string;
    profileImg: string;
}>

export default function ParticipantsContainer({users, closeParticipants}: IProps) {
    return (
        <div className={`${styles.container}`}>
            <div className={styles.close} onClick={closeParticipants}><CloseSvg/></div>
            <div className={styles.content}>
                {users?.map((user, index)=>(<div key={index} className={styles.user}>
                    <div className={styles.profileImg}>
                        <UserProfileImgRender user={user} />
                    </div>
                    <Link href={`/user/${user.userId}`}>{user.name}</Link>
                </div>))}
            </div>
        </div>
    )
}