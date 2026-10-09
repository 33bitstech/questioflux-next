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
import { trackEvent } from '@/utils/analytics'

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

    const trackShare = (method: 'whatsapp' | 'facebook' | 'copy_link') =>
        trackEvent('share', { method, content_type: 'quiz', item_id: quizId })

    return (
        <div className={styles.share}>
            
            {closeShareContainer && <div className={styles.close} onClick={closeShareContainer}><CloseSvg/></div>}
            <h3>{t('title')}</h3>

            <section className={styles.apps_share}>
                {/* Link do Whatsapp agora usa o texto traduzido */}
                <a href={`whatsapp://send?text=${whatsappText} https://www.questioflux.com/${locale}/quiz/${quizId}`} target='_blank' className={styles.app} onClick={() => trackShare('whatsapp')}>
                    <WhatsappSvg/>
                    <p>Whatsapp</p>
                </a>
                <a target='_blank' href={`https://www.facebook.com/sharer/sharer.php?u=https://www.questioflux.com/${locale}/quiz/${quizId}`} className={styles.app} onClick={() => trackShare('facebook')}>
                    <FacebookSvg/>
                    <p>Facebook</p>
                </a>
            </section>
            <button 
                onClick={()=>{
                    trackShare('copy_link')
                    handleCopyUrl(`${locale}/quiz/${quizId}`)
                        .then(()=>setSucess(t('copySuccessMessage')))
                }}>
                <CopyIcon />
                {t('copyLinkButton')}
            </button>
        </div>
    )
}