'use client'
import React, { useState } from 'react'
import ShareContainer from './share-container'
import { TStyles } from '@/types/stylesType'
import { useTranslations } from 'next-intl' // Importar
import { QuizKind } from '@/utils/quizKind'

interface IProps {
    quizId: string,
    styles: TStyles,
    // torneio, história e teste: os textos usam o nome do formato, não "quiz"
    kind?: QuizKind
}

export default function ShareButton({quizId, styles, kind = 'quiz'}: IProps) {
    const t = useTranslations('quizActions.share'); // Inicializar hook
    const [openShare, setOpenShare] = useState<boolean>(false)

    return (
        <>
            {/* Usar a tradução */}
            <button className={styles.share_quiz} onClick={()=>setOpenShare(!openShare)}>{t('button', { kind })}</button>

            {openShare && <div className={styles.sharing_container}>
                <ShareContainer quizId={quizId} kind={kind} closeShareContainer={()=>setOpenShare(value=>!value)}/>
            </div>}
            
            {openShare && <div className={styles.overlay_share} onClick={()=>setOpenShare(false)}></div>}
        </>
    )
}