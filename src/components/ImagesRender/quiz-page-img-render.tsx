'use client'
import IQuizes from '@/interfaces/IQuizes'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import React, { useState, useEffect } from 'react' // 1. Importar o useEffect

export default function QuizPageImgRender({quiz}: {quiz:IQuizes}) {
    const [imageBackup, setImageBackup] = useState<boolean>(false)
    const { theme } = useTheme()
    const [mounted, setMounted] = useState(false) // 2. Criar o estado 'mounted'

    // 3. Este hook só será executado no lado do cliente, após a primeira renderização.
    useEffect(() => {
        setMounted(true)
    }, [])

    // 4. Enquanto o componente não estiver montado, não renderizamos nada (ou um placeholder)
    // para evitar a inconsistência entre servidor e cliente.
    if (!mounted) {
        return null
    }

    // Agora que temos certeza que estamos no cliente, a lógica funcionará corretamente.
    const imageSrc = quiz.quizThumbnail !== 'default' && !imageBackup
        ? quiz.quizThumbnail
        : theme === 'dark'
            ? '/quiz_padrao_preto.png'
            : '/quiz_padrao_branco.png'

    return (
        <Image
            alt={quiz.description}
            width={800}
            height={800}
            quality={100}
            onError={() => {
                setImageBackup(true)
            }}
            src={imageSrc}
        />
    )
}