'use client'
import { TStyles } from '@/types/stylesType'
import { useRouter } from '@/i18n/navigation'
import React from 'react'

interface IProps{
    styles: TStyles
}

export default function ButtonBack({styles}:IProps) {
    const route = useRouter()
    return (
        <button className={styles.btn_back} onClick={()=>{
            route.back()
        }}>
            Back
        </button>
    )
}
