'use client'
import { TStyles } from '@/types/stylesType'
import React, { useEffect, useState } from 'react'
import QuizIcon from '../Icons/QuizIcon'
import Link from 'next/link'
import { useUser } from '@/contexts/userContext'
import { cancelSubscription, verifyUserPremium } from '@/app/(quizGroup)/profile/config/actions'
import { useGlobalMessage } from '@/contexts/globalMessageContext'


interface IProps{
    styles: TStyles,
}

export default function SubscriptionContainer({styles}:IProps) {
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
    },[])

    return (
        <div className={styles.planos}>
            <h5>Active ({premium ? 1 : 0})</h5>
            <section className={styles.gamepass}>
                <article>
                    <div className={styles.gamepass_details}>
                        <QuizIcon/>
                        <div className={styles.gamepass_details_infos}>
                            <span>
                                <h3>VortexPlus</h3>
                                <span className={styles.desc}>$2,50/month</span>
                            </span>
                        </div>
                    </div>
                    {!premium && <Link href='/subscription/vortexplus'>Subscribe</Link>}
                    {premium && <button onClick={handleUnsub}>Unsubscribe</button>}
                </article>
                <article>
                    <div className={styles.gamepass_details}>
                        <QuizIcon/>
                        <div className={styles.gamepass_details_infos}>
                            <span>
                                <h3>VortexPlus Usage ({specialCount || 0})</h3>
                                <span className={styles.desc}>$1,99/use</span>
                            </span>
                        </div>
                    </div>
                    <Link href='/subscription/vortexplususage'>Buy</Link>
                </article>
            </section>
        </div>
    )
}
