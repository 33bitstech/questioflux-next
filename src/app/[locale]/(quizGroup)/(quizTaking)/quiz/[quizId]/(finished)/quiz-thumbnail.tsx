'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

interface IProps {
    src: string
    alt: string
}

export default function QuizThumbnail({ src, alt }: IProps) {
    const { theme } = useTheme()
    const defaultThumbnail = theme === 'light' ? '/quiz_padrao_branco.png' : '/quiz_padrao_preto.png'
    const [imgSrc, setImgSrc] = useState<string>(
        src !== 'default' ? src : defaultThumbnail
    )

    useEffect(() => {
        if (!src || src === 'default') {
            setImgSrc(defaultThumbnail)
        }
    }, [theme])

    return (
        <Image
            src={imgSrc}
            alt={alt}
            width={800}
            height={800}
            quality={100}
            fetchPriority='high'
            loading='lazy'
            onError={() => setImgSrc(defaultThumbnail)}
        />
    )
}