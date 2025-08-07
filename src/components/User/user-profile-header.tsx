'use client'
import { useUser } from '@/contexts/userContext'
import React, { useEffect, useState } from 'react'
import styles from './user-profile-header.module.scss'
import { IUser } from '@/interfaces/IUser'
import UserProfileImgRender from '../ImagesRender/user-profile-img-render'
import { verifyUserPremium } from '@/app/[locale]/(quizGroup)/profile/config/actions'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { IPremium } from '@/interfaces/IPremium'
import BadgeContainer from './badge-container'
import VortexplusBadge from '../Icons/Badges/vortexplus-badge'
import VortexplususageBadge from '../Icons/Badges/vortexplususage-badge'

interface IProps {
    userP?: IUser
}

export default function UserProfileHeader({userP}: IProps) {
    const {user, token} = useUser(),
        {setError} = useGlobalMessage(),
        [premiumStatus, setPremiumStatus] = useState<IPremium>() 
    

    useEffect(()=>{
        if(!userP){
            const get = async() =>{
                try {
                    const res = await verifyUserPremium(`${token}`)
                    if(res.err) return setError(res.err)
                    setPremiumStatus(res.premium)
                } catch (err) {
                    console.log(err)
                }
            }
            get()
        }else{
            setPremiumStatus({
                premium: userP.premium ?? false,
                specialCount: userP.specialCount ?? 0
            })
        }
    },[])

    return (
        <div className={styles.profile_container}>
            <div className={styles.image_container}>
                <div className={styles.image_content}>
                    { (userP || user) && <UserProfileImgRender user={userP || user as IUser}/> }
                </div>
            </div>
            <div className={styles.profile_actions}>
                <div className={styles.Username}>
                    <h1>{userP?.name || user?.name || ''}</h1>
                </div>
                <div className={styles.badges}>
                    {premiumStatus && <>
                        {premiumStatus.premium && 
                            <BadgeContainer 
                                premiumStatus={premiumStatus}
                                typeBadge='Questioplus'
                            >
                                <VortexplusBadge/>
                            </BadgeContainer>
                        }
                    
                        {premiumStatus.specialCount > 0 && 
                            <BadgeContainer 
                                premiumStatus={premiumStatus}
                                typeBadge='Questioplususage'
                            >
                                <VortexplususageBadge/>
                            </BadgeContainer>
                        }
                    </>}
                </div>
            </div>
        </div>
    )
}
