'use client'
import NavLink from '@/components/widgets/NavLink'
import { useUser } from '@/contexts/userContext'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function LinkProfile() {
    const {user} = useUser();
    const t = useTranslations('navbar.asideMenu');

    return (
        <NavLink href={`/user/${user?.userId}`}>{t('profile')}</NavLink>
    )
}