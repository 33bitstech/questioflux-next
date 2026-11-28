'use client'
import { DragEvent, useState } from 'react'

// Arrastar uma imagem do computador para o espaço da imagem (como no quiz de imagens clássico).
// Entrega o primeiro arquivo solto; tipo e tamanho são conferidos por quem recebe.
export function useImageDrop(onFile: (file: File) => void, disabled?: boolean) {
    const [dragging, setDragging] = useState(false)

    const carriesFiles = (event: DragEvent<HTMLElement>) => event.dataTransfer.types.includes('Files')

    const over = (event: DragEvent<HTMLElement>) => {
        if (disabled || !carriesFiles(event)) return
        event.preventDefault()
        event.dataTransfer.dropEffect = 'copy'
        setDragging(true)
    }

    return {
        dragging,
        dropProps: {
            onDragEnter: over,
            onDragOver: over,
            onDragLeave: (event: DragEvent<HTMLElement>) => {
                // passar por cima da imagem ou do ícone de dentro não conta como sair
                if (event.currentTarget.contains(event.relatedTarget as Node | null)) return
                setDragging(false)
            },
            onDrop: (event: DragEvent<HTMLElement>) => {
                if (disabled || !carriesFiles(event)) return
                event.preventDefault()
                setDragging(false)
                const file = event.dataTransfer.files?.[0]
                if (file) onFile(file)
            },
        },
    }
}
