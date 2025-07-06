'use client'
import { TStyles } from '@/types/stylesType'
import { useRouter } from '@/i18n/navigation'
import React from 'react'
import { useTranslations } from 'next-intl'

interface IProps{
    styles: TStyles
}

export default function ButtonBack({styles}:IProps) {
    const route = useRouter(),
        t = useTranslations('editQuizFlow.buttons')
    return (
        <button className={styles.btn_back} onClick={()=>{
            route.back()
        }}>
            {t('back')}
        </button>
    )
}
