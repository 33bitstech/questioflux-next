'use client'

import IQuizes from '@/interfaces/IQuizes'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import React, { useState } from 'react'
import styles from './recommended-quiz-popup.module.scss'
import { Minimize2 } from 'lucide-react'

interface IProps {
    quiz: IQuizes
    locale: string
    recommendationLabel: string
    minimizeLabel: string
    maximizeLabel: string
}


function MaximizeIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 3H3v5" />
            <path d="M16 3h5v5" />
            <path d="M3 16v5h5" />
            <path d="M21 16v5h-5" />
        </svg>
    )
}

export default function RecommendedQuizPopup({
    quiz,
    locale,
    recommendationLabel,
    minimizeLabel,
    maximizeLabel,
}: IProps) {
    const [isMinimized, setIsMinimized] = useState(false)
    const [imageBackup, setImageBackup] = useState(false)
    const { theme, resolvedTheme } = useTheme()

    const currentTheme = resolvedTheme ?? theme

    const imageSrc =
        quiz.quizThumbnail !== 'default' && !imageBackup
            ? quiz.quizThumbnail
            : currentTheme === 'dark'
                ? '/quiz_padrao_preto.png'
                : '/quiz_padrao_branco.png'

    if (isMinimized) {
        return (
            <button
                type="button"
                className={styles.minimized_popup}
                onClick={() => setIsMinimized(false)}
                aria-label={maximizeLabel}
                title={maximizeLabel}
            >
                <MaximizeIcon />
            </button>
        )
    }

    return (
        <aside className={styles.recommendation_popup} aria-label={recommendationLabel}>
            <button
                type="button"
                className={styles.minimize_button}
                onClick={() => setIsMinimized(true)}
                aria-label={minimizeLabel}
                title={minimizeLabel}
            >
                <Minimize2 />
            </button>

            <p className={styles.recommendation_label}>
                {recommendationLabel}
            </p>

            <Link
                href={`/${locale}/quiz/${quiz.quizId}`}
                className={styles.image_link}
                aria-label={`${recommendationLabel}: ${quiz.title}`}
            >
                <Image
                    src={imageSrc}
                    alt={quiz.title}
                    fill
                    sizes="(max-width: 560px) 85vw, 320px"
                    onError={() => setImageBackup(true)}
                />
            </Link>

            <div className={styles.quiz_title_area}>
                <p>{quiz.title}</p>
            </div>
        </aside>
    )
}