'use client'
import IQuizes from '@/interfaces/IQuizes'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import React, { useState } from 'react'

export default function QuizPageImgRender({quiz}: {quiz:IQuizes}) {
    const [imageBackup, setImageBackup] = useState<boolean>(false),
        {theme} = useTheme()
    return (
        <Image 
            alt={quiz.description}
            width={800}
            height={800}
            quality={100}
            onError={()=>{
                setImageBackup(true)
            }}
            src={
                quiz.quizThumbnail !== 'default' && !imageBackup
                    ? quiz.quizThumbnail 
                    : theme === 'dark' 
                        ? '/quiz_padrao_preto.png'
                        : '/quiz_padrao_branco.png'
            }
        />
    )
}
