import NavbarQuizgroup from '@/components/NavbarQuizgroup/navbar'
import React, { ReactNode } from 'react'
import styles from './layout.module.scss'
import { Metadata } from 'next';
import ContextualHeaderActions from '@/components/NavigateWidgets/contextual-header-action';

export const metadata: Metadata = {
    title: 'Edit your quiz'
};


export default function LayoutUserQuizzes({children}: {children :ReactNode}) {
    return (  
        <>
            {children}
        </>
    )
}
