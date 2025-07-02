'use client'
import React from 'react'
import styles from './share-container.module.scss'
import CloseSvg from '../Icons/CloseSvg'
import CopyIcon from '../Icons/CopyIcon'
import { handleCopyUrl } from '@/utils/handleCopy'
import WhatsappSvg from '../Icons/Logos/WhatsappSvg'
import FacebookSvg from '../Icons/Logos/FacebookSvg'
import { useGlobalMessage } from '@/contexts/globalMessageContext'

interface IProps {
    quizId: string,
    closeShareContainer?: ()=>void
}

export default function ShareContainer({closeShareContainer, quizId}:IProps) {
    const {setSucess} = useGlobalMessage()
    return (
        <div className={styles.share}>
            
            {closeShareContainer && <div className={styles.close} onClick={closeShareContainer}><CloseSvg/></div>}
            <h3>Share with your friends</h3>

            <section className={styles.apps_share}>
                <a href={`whatsapp://send?text=Faça esse quiz! https://www.quizvortex.site/quiz/${quizId}`} target='_blank' className={styles.app}>
                    <WhatsappSvg/>
                    <p>Whatsapp</p>
                </a>
                <a target='_blank' href={`https://www.facebook.com/sharer/sharer.php?u=https://www.quizvortex.site/quiz/${quizId}`} className={styles.app}>
                    <FacebookSvg/>
                    <p>Facebook</p>
                </a>
            </section>
            <button 
                onClick={()=>{
                    handleCopyUrl(`quiz/${quizId}`)
                        .then(()=>setSucess('Link copied successfully !'))
                }}>
                <CopyIcon />
                Copy link
            </button>
        </div>
    )
}
