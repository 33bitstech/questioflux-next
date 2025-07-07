'use client'
import IQuizes from '@/interfaces/IQuizes'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import React, { useState, useEffect } from 'react' 
import styles from './user-profile-img-render.module.scss'
import Skeleton from '../Loading/skeleton'

export default function QuizPageImgRender({quiz}: {quiz:IQuizes}) {
    const [imageBackup, setImageBackup] = useState<boolean>(false)
    const { theme } = useTheme()
    const [mounted, setMounted] = useState(false) 
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const imageSrc = quiz.quizThumbnail !== 'default' && !imageBackup
        ? quiz.quizThumbnail
        : theme === 'dark'
            ? '/quiz_padrao_preto.png'
            : '/quiz_padrao_branco.png'

    return (
        <>
            {isLoading && <Skeleton/>}
            <Image
                alt={quiz.description}
                className={isLoading ? styles.image_loading : styles.image_loaded}
                width={800}
                height={800}
                quality={100}
                onError={() => {
                    setIsLoading(false)
                    setImageBackup(true)
                }}
                onLoad={()=>{
                    setIsLoading(false)
                }}
                src={imageSrc}
            />
        </>
    )
}