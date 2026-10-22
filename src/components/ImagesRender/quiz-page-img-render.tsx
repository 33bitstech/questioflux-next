'use client'
import IQuizes from '@/interfaces/IQuizes'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import styles from './user-profile-img-render.module.scss'

// Capa no topo da página do quiz. A capa própria vai no HTML do servidor: antes ela só
// aparecia depois do JavaScript, e o Google recebia a página sem nenhuma imagem do quiz.
// Só a imagem padrão (sem capa) espera montar, porque depende do tema claro/escuro.
export default function QuizPageImgRender({quiz}: {quiz:IQuizes}) {
    const [imageBackup, setImageBackup] = useState<boolean>(false)
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const hasCover = !!quiz.quizThumbnail && quiz.quizThumbnail !== 'default' && !imageBackup

    if (hasCover) {
        return (
            <Image
                alt={quiz.title}
                className={styles.image_loaded}
                width={800}
                height={800}
                quality={90}
                sizes="(max-width: 860px) 93vw, 800px"
                src={quiz.quizThumbnail}
                onError={() => setImageBackup(true)}
                priority
            />
        )
    }

    if (!mounted) return null

    return (
        <Image
            alt={quiz.title}
            className={styles.image_loaded}
            width={800}
            height={800}
            src={resolvedTheme === 'light' ? '/quiz_padrao_branco.png' : '/quiz_padrao_preto.png'}
        />
    )
}
