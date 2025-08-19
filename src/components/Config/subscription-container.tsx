'use client'
import { TStyles } from '@/types/stylesType'
import React, { useEffect, useState } from 'react'
import QuizIcon from '../Icons/QuizIcon'
import {Link} from '@/i18n/navigation'
import { useUser } from '@/contexts/userContext'
import { cancelSubscription, verifyUserPremium } from '@/app/[locale]/(quizGroup)/profile/config/actions'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { useTranslations } from 'next-intl'

interface IProps{
    styles: TStyles,
}

export default function SubscriptionContainer({styles}:IProps) {
    const t = useTranslations('configPage.subscriptionContainer');
    const {user, token} = useUser(),
        {setError} = useGlobalMessage(),
        [premium, setPremium] = useState<boolean>(false),
        [specialCount, setSpecialCount] = useState<number>(0)

    const handleUnsub = ()=>{
        if (premium){
            verifyUserPremium(`${token}`).then(res=>{
                if(res.premium.premium){
                    cancelSubscription(`${token}`).then(res=>{
                        if(res?.err) setError(res.err)
                    })
                } 
            })
        }
    }

    useEffect(()=>{
        const get = async() =>{
            try {
                const res = await verifyUserPremium(`${token}`)
                if(res.err) return setError(res.err)
                setPremium(res.premium.premium)
                setSpecialCount(res.premium.specialCount)
            } catch (err) {
                console.log(err)
            }
        }
        get()
    },[cancelSubscription, user])

    return (
        <div className={styles.planos}>
            <h5>{t('activeTitle', { count: premium ? 1 : 0 })}</h5>
            <section className={styles.gamepass}>
                <article>
                    <div className={styles.gamepass_details}>
                        <QuizIcon/>
                        <div className={styles.gamepass_details_infos}>
                            <span>
                                <h3>{t('vortexPlus.title')}</h3>
                                <span className={styles.desc}>{t('vortexPlus.price')}</span>
                            </span>
                        </div>
                    </div>
                    {!premium && <Link href='/subscription/vortexplus'>{t('vortexPlus.subscribeButton')}</Link>}
                    {premium && <button onClick={handleUnsub}>{t('vortexPlus.unsubscribeButton')}</button>}
                </article>
                <article>
                    <div className={styles.gamepass_details}>
                        <QuizIcon/>
                        <div className={styles.gamepass_details_infos}>
                            <span>
                                <h3>{t('vortexPlusUsage.title', { count: specialCount || 0 })}</h3>
                                <span className={styles.desc}>{t('vortexPlusUsage.price')}</span>
                            </span>
                        </div>
                    </div>
                    <Link href='/subscription/questioplususage'>{t('vortexPlusUsage.buyButton')}</Link>
                </article>
            </section>
        </div>
    )
}