'use client'
import React, { useState } from 'react'
import { QrCode, Download } from 'lucide-react'
import styles from './share-container.module.scss'
import CloseSvg from '../Icons/CloseSvg'
import CopyIcon from '../Icons/CopyIcon'
import { handleCopyUrl } from '@/utils/handleCopy'
import WhatsappSvg from '../Icons/Logos/WhatsappSvg'
import FacebookSvg from '../Icons/Logos/FacebookSvg'
import XSvg from '../Icons/Logos/XSvg'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { useLocale, useTranslations } from 'next-intl'
import { trackEvent } from '@/utils/analytics'

interface IProps {
    quizId: string,
    closeShareContainer?: ()=>void
}

const SITE = 'https://www.questioflux.com'

export default function ShareContainer({closeShareContainer, quizId}:IProps) {
    const t = useTranslations('quizActions.share')
    const locale = useLocale()
    const {setSucess, setError} = useGlobalMessage()
    const [qrImage, setQrImage] = useState<string>()
    const [qrLoading, setQrLoading] = useState(false)

    const quizUrl = `${SITE}/${locale}/quiz/${quizId}`
    // o QR Code abre direto a partida: em um evento, quem escaneia já começa a jogar
    const playUrl = `${quizUrl}/taking`

    const shareText = encodeURIComponent(t('whatsappMessage'))

    const trackShare = (method: 'whatsapp' | 'facebook' | 'x' | 'qr_code' | 'qr_code_download' | 'copy_link') =>
        trackEvent('share', { method, content_type: 'quiz', item_id: quizId })

    const toggleQr = async () => {
        if (qrImage) return setQrImage(undefined)
        setQrLoading(true)
        try {
            // a biblioteca só vem quando alguém pede o QR Code
            const QRCode = (await import('qrcode')).default
            // preto no branco, com margem: é o que qualquer câmera lê melhor, mesmo no tema escuro
            setQrImage(await QRCode.toDataURL(playUrl, { width: 600, margin: 2, errorCorrectionLevel: 'M', color: { dark: '#000000', light: '#ffffff' } }))
            trackShare('qr_code')
        } catch {
            setError(t('qrError'))
        } finally {
            setQrLoading(false)
        }
    }

    return (
        <div className={styles.share}>

            {closeShareContainer && <div className={styles.close} onClick={closeShareContainer}><CloseSvg/></div>}
            <h3>{t('title')}</h3>

            <section className={styles.apps_share}>
                <a href={`whatsapp://send?text=${shareText} ${quizUrl}`} target='_blank' className={styles.app} onClick={() => trackShare('whatsapp')}>
                    <WhatsappSvg/>
                    <p>Whatsapp</p>
                </a>
                <a target='_blank' href={`https://www.facebook.com/sharer/sharer.php?u=${quizUrl}`} className={styles.app} onClick={() => trackShare('facebook')}>
                    <FacebookSvg/>
                    <p>Facebook</p>
                </a>
                <a target='_blank' rel='noopener noreferrer' href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(quizUrl)}`} className={styles.app} onClick={() => trackShare('x')}>
                    <XSvg/>
                    <p>X (Twitter)</p>
                </a>
                <button type='button' className={styles.app} onClick={toggleQr} aria-expanded={!!qrImage} disabled={qrLoading}>
                    <span className={styles.qr_icon}><QrCode aria-hidden='true' /></span>
                    <p>{t('qrButton')}</p>
                </button>
            </section>

            {qrImage && (
                <section className={styles.qr_panel}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- imagem gerada na hora (data URL) */}
                    <img src={qrImage} alt={t('qrAlt')} width={200} height={200} />
                    <p>{t('qrHint')}</p>
                    <a
                        href={qrImage}
                        download={`questioflux-qr-${quizId}.png`}
                        className={styles.qr_download}
                        onClick={() => trackShare('qr_code_download')}
                    >
                        <Download aria-hidden='true' /> {t('qrDownload')}
                    </a>
                </section>
            )}

            <button
                className={styles.copy}
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
