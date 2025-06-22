'use client'
import React, { useState } from 'react'
import ShareContainer from './share-container'
import { TStyles } from '@/types/stylesType'

interface IProps {
    quizId: string,
    styles: TStyles
}

export default function ShareButton({quizId, styles}: IProps) {
    const [openShare, setOpenShare] = useState<boolean>(false)
    return (
        <>

            <button onClick={()=>setOpenShare(!openShare)}>Share Quiz</button>

            {openShare && <div className={styles.sharing_container}>
                <ShareContainer quizId={quizId} closeShareContainer={()=>setOpenShare(value=>!value)}/>
            </div>}
            
            {openShare && <div className={styles.overlay_share} onClick={()=>setOpenShare(false)}></div>}

        </>
    )
}
