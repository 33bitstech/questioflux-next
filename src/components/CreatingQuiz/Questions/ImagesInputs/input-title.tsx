'use client'

import UploadImageSvg from '@/components/Icons/UploadImageSvg'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { ILocalQuestions } from '@/interfaces/ILocalQuestions'
import { TStyles } from '@/types/stylesType'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { ChangeEvent, DragEvent, useEffect, useState } from 'react'

interface IProps {
    styles: TStyles
    onQuestionImageChange: (file: File | string) => void
    onMultipleImageUpload: (files: FileList) => void
    question: ILocalQuestions
}

export default function InputTitle({
    styles,
    onQuestionImageChange,
    question,
    onMultipleImageUpload
}: IProps) {
    const [questionDraft, setQuestionDraft] = useState<string>('')
    const [isDragging, setIsDragging] = useState<boolean>(false)

    const { setError } = useGlobalMessage()
    const t = useTranslations('profileUpload')

    const handleFiles = (files: FileList | null) => {
        if (!files || files.length === 0) return

        const filesArray = Array.from(files)

        const hasInvalidFile = filesArray.some(file => {
            return !file.name.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/i)
        })

        if (hasInvalidFile) {
            setError(t('errorInvalidType'))
            return
        }

        if (files.length > 1) {
            onMultipleImageUpload(files)
            return
        }

        const image = files[0]

        setQuestionDraft(URL.createObjectURL(image))
        onQuestionImageChange(image)
    }

    const handleImageQuestion = (e: ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files)
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

        handleFiles(files)
    }

    useEffect(() => {
        if (!question.image) {
            setQuestionDraft('')
            return
        }

        if (typeof question.image === 'string') {
            setQuestionDraft(question.image)
            return
        }

        const objectUrl = URL.createObjectURL(question.image)
        setQuestionDraft(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)
    }, [question.image])

    return (
        <label
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageQuestion}
            />

            <div className={`${styles.image_label_container} ${styles.questionImage} ${isDragging ? styles.dragging : ''}`}>
                {questionDraft && (
                    <Image
                        width={500}
                        height={500}
                        src={questionDraft}
                        alt="Imagem da questão"
                        draggable={false}
                    />
                )}

                {!questionDraft && (
                    <span>
                        <UploadImageSvg />
                    </span>
                )}
            </div>
        </label>
    )
}