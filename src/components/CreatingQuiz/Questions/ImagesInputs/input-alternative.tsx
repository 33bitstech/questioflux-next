'use client'

import UploadImageSvg from '@/components/Icons/UploadImageSvg'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { TStyles } from '@/types/stylesType'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { ChangeEvent, DragEvent, useEffect, useState } from 'react'

interface IProps {
    styles: TStyles
    onAlternativeImageChange: (altIndex: number, file: File | string) => void
    i: number
    alternative: {
        id: string
        answer?: string
        thumbnail?: string | File
    }
}

export default function InputAlternative({
    styles,
    onAlternativeImageChange,
    i,
    alternative
}: IProps) {
    const { setError } = useGlobalMessage()
    const t = useTranslations('creation')

    const [isDragging, setIsDragging] = useState<boolean>(false)
    const [preview, setPreview] = useState<string>('')

    const isValidImage = (file: File) => {
        return file.name.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/i)
    }

    const handleFile = (file: File | undefined) => {
        if (!file) return

        if (!isValidImage(file)) {
            setError(t('sharedErrors.invalidFileType'))
            return
        }

        onAlternativeImageChange(i, file)
    }

    const handleImageAlternative = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files

        if (!files || files.length === 0) return

        handleFile(files[0])
        e.target.value = ''
    }

    const handleDragEnter = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault()
        e.stopPropagation()

        setIsDragging(false)

        const files = e.dataTransfer.files
        if (!files || files.length === 0) return

        handleFile(files[0])
    }

    useEffect(() => {
        if (!alternative.thumbnail) {
            setPreview('')
            return
        }

        if (typeof alternative.thumbnail === 'string') {
            setPreview(alternative.thumbnail)
            return
        }

        const objectUrl = URL.createObjectURL(alternative.thumbnail)
        setPreview(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)
    }, [alternative.thumbnail])

    return (
        <label
            className={styles.dropLabel}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                type="file"
                accept="image/*"
                onChange={handleImageAlternative}
            />

            <div className={`${styles.image_label_containers} ${isDragging ? styles.dragging : ''}`}>
                {preview && (
                    <Image
                        src={preview}
                        alt={t('imageInputs.altAlternative')}
                        height={200}
                        width={200}
                    />
                )}

                {!preview && (
                    <span>
                        <UploadImageSvg />
                    </span>
                )}
            </div>
        </label>
    )
}