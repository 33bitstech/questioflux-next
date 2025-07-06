import React, { ReactNode } from 'react'
import styles from './layout.module.scss'
import { Metadata } from 'next';
import ButtonBack from '@/components/widgets/button-back';

export const metadata: Metadata = {
    title: 'Taking'
};


interface IProps {
    children: ReactNode
}

export default async function LayoutTaking({children}: IProps) {

    return (
        <main className={styles.content}>
            <ButtonBack 
                styles={styles} 
            />
            {children}
        </main>
    )
}
