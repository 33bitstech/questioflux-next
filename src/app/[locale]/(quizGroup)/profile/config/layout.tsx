import NavbarQuizgroup from '@/components/NavbarQuizgroup/navbar'
import React, { ReactNode } from 'react'
import styles from './layout.module.scss'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Configuration'
};

export default function LayoutQuizGroup({children}: {children :ReactNode}) {
    return (
        <>
            {children}
        </>
    )
}
