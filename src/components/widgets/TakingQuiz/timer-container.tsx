'use client'
import Skeleton from '@/components/Loading/skeleton'
import IQuizes from '@/interfaces/IQuizes'
import { TStyles } from '@/types/stylesType'
import { getTimeObject } from '@/utils/FormatTime'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import stylesS from '@/components/ImagesRender/user-profile-img-render.module.scss'

interface IProps{
    styles: TStyles,
    quiz: IQuizes,
    started: boolean,
    setStarted: ()=>void,
    initialTime: number
}

export default function TimerContainer({styles, quiz, setStarted, started, initialTime}:IProps) {
    const [passedTime, setPassedTime] = useState<number>(0)
    const t = useTranslations('takingPage')
    const [loading, setLoading] = useState(true)

    type TimeKey = 'hours' | 'minutes' | 'seconds' | 'miliseconds';
    const formatTimeValue = (typeTime: TimeKey) =>{
        return String(getTimeObject(passedTime)[typeTime]).padStart(2, '0')
    }

    useEffect(()=>{
        let interval: NodeJS.Timeout | undefined
        if(started){
            interval = setInterval(() => {
                setPassedTime(Date.now() - initialTime)
            }, 20);
        }
        return () => {
            if (interval) clearInterval(interval)
        }
    }, [started, initialTime])
    
    return (
        <div className={styles.img_quiz_container}>
            {loading && <Skeleton/>}
            <Image 
                className={loading ? stylesS.image_loading : stylesS.image_loaded}
                src={quiz?.quizThumbnail !== 'default' 
                    ? quiz?.quizThumbnail 
                    : '/imageQuizDefault.jpg'} 
                alt="quiz image" 
                width={800}
                height={800}
                quality={100}
                onLoad={()=>setLoading(false)}
                onError={()=>setLoading(false)}
            />
            <div className={styles.time}>
                <div className={styles.timer}>
                    <span>{formatTimeValue('minutes')}</span>
                    <span>:</span>
                    <span>{formatTimeValue('seconds')}</span>
                    <span>:</span>
                    <span>{formatTimeValue('miliseconds')}</span>
                </div>
                <div className={styles.time_action}>
                    <button 
                        onClick={setStarted} 
                        className={started ? styles.button_started : ''}
                    >{t('buttonStart')}</button>
                </div>
            </div>
        </div>
    )
}
