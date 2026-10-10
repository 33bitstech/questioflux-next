'use client'
import Image from 'next/image'
import { useState } from 'react'

interface IProps {
    src?: string
    alt: string
    sizes: string
}

// Capa de quiz que preenche o elemento pai (precisa de position: relative).
// Sem capa, ou se a imagem falhar, mostra a capa padrão.
export default function QuizCover({ src, alt, sizes }: IProps) {
    const [failed, setFailed] = useState(false)

    return (
        <Image
            src={src && !failed ? src : '/quiz_padrao_preto.png'}
            alt={alt}
            fill
            sizes={sizes}
            onError={() => setFailed(true)}
        />
    )
}
