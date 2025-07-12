'use client'
import { IPremium } from '@/interfaces/IPremium'
import { TBadges } from '@/types/badgesTypes'
import { useTranslations } from 'next-intl'
import React, { ReactNode } from 'react'
import styles from './badge-container.module.scss'

interface IProps {
    children: ReactNode,
    premiumStatus: IPremium,
    typeBadge: TBadges
}

export default function BadgeContainer({children, premiumStatus, typeBadge}:IProps) {
    const t = useTranslations('badgesDesc')

    const descriptions = {
        Vortexplus: t('vortexplus'),
        Vortexplususage: t('vortexplususage', {qtd:premiumStatus.specialCount})
    }

    return (
        <div className={styles.badge_container}>
            {children}
            <span className={styles.badge_description}>
                {descriptions[typeBadge]}
            </span>
        </div>
    )
}
