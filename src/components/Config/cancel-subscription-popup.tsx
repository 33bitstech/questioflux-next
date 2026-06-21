'use client'

import { TStyles } from '@/types/stylesType'

interface ICancelSubscriptionPopupProps {
    styles: TStyles
    title: string
    description: string
    keepButtonText: string
    confirmButtonText: string
    onClose: () => void
    onConfirm: () => void
}

export default function CancelSubscriptionPopup({
    styles,
    title,
    description,
    keepButtonText,
    confirmButtonText,
    onClose,
    onConfirm
}: ICancelSubscriptionPopupProps) {
    return (
        <div className={styles['cancel-subscription-popup-overlay']}>
            <div className={styles['cancel-subscription-popup']}>
                <h3>{title}</h3>

                <p>{description}</p>

                <div className={styles['cancel-subscription-popup-actions']}>
                    <button
                        type="button"
                        className={styles['cancel-subscription-popup-secondary']}
                        onClick={onClose}
                    >
                        {keepButtonText}
                    </button>

                    <button
                        type="button"
                        className={styles['cancel-subscription-popup-danger']}
                        onClick={onConfirm}
                    >
                        {confirmButtonText}
                    </button>
                </div>
            </div>
        </div>
    )
}