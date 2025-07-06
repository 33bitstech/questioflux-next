'use client'
import React from 'react'
import styles from './share-container.module.scss'
import CloseSvg from '../Icons/CloseSvg'
import CopyIcon from '../Icons/CopyIcon'
import { handleCopyUrl } from '@/utils/handleCopy'
import WhatsappSvg from '../Icons/Logos/WhatsappSvg'
import FacebookSvg from '../Icons/Logos/FacebookSvg'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { useLocale, useTranslations } from 'next-intl' // Importar

interface IProps {
    quizId: string,
    closeShareContainer?: ()=>void
}

export default function ShareContainer({closeShareContainer, quizId}:IProps) {
    const t = useTranslations('quizActions.share'); // Inicializar hook
    const locale = useLocale()
    const {setSucess} = useGlobalMessage()

    // Mensagem traduzida e formatada para URL
    const whatsappText = encodeURIComponent(t('whatsappMessage'));

    return (
        <div className={styles.share}>
            
            {closeShareContainer && <div className={styles.close} onClick={closeShareContainer}><CloseSvg/></div>}
            <h3>{t('title')}</h3>

            <section className={styles.apps_share}>
                {/* Link do Whatsapp agora usa o texto traduzido */}
                <a href={`whatsapp://send?text=${whatsappText} https://www.quizvortex.site/quiz/${quizId}`} target='_blank' className={styles.app}>
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
                    handleCopyUrl(`/${locale}/quiz/${quizId}`)
                        .then(()=>setSucess(t('copySuccessMessage')))
                }}>
                <CopyIcon />
                {t('copyLinkButton')}
            </button>
        </div>
    )
}