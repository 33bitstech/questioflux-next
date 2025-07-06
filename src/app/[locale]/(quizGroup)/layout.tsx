import NavbarQuizgroup from '@/components/NavbarQuizgroup/navbar'
import React, { ReactNode } from 'react'
import styles from './layout.module.scss'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        template:'%s',
        default: 'Quiz Vortex'
    }
};

interface IProps{
    params: Promise<{
        locale:string
    }>
    children: ReactNode
}

export default async function LayoutQuizGroup({children, params}:IProps) {
    const {locale} = await params
    return (
        <div className={styles.container}>
            <header>
                <NavbarQuizgroup
                    locale={locale}
                />
            </header>
            {children}
        </div>
    )
}
