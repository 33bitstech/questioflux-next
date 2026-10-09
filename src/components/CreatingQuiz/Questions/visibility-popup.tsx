'use client'
import { useTranslations } from 'next-intl'
import styles from './visibility-popup.module.scss'

interface IProps {
    onChoose: (makePublic: boolean) => void
    onClose: () => void
}

export default function VisibilityPopup({ onChoose, onClose }: IProps) {
    const t = useTranslations('creatingQuiz.questionsForm.visibilityPopup')

    return (
        <>
            <div className={styles.overlay} onClick={onClose}></div>
            <div className={styles.container} role='dialog' aria-modal='true' aria-labelledby='visibility-popup-title'>
                <h3 id='visibility-popup-title'>{t('title')}</h3>
                <p>{t('text')}</p>
                <div className={styles.actions}>
                    <button type='button' onClick={() => onChoose(false)}>{t('keepPrivate')}</button>
                    <button type='button' onClick={() => onChoose(true)}>{t('makePublic')}</button>
                </div>
            </div>
        </>
    )
}
