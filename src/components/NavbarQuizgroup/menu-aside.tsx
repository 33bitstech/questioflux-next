'use client' // Deve ser um Client Component
import NavLink from '@/components/widgets/NavLink'
import { CookieValueTypes } from 'cookies-next'
import React from 'react'
import LangsWidget from './client/langs-widget'
import ThemeWidget from './client/theme-widget'
import GamepassWidget from './client/gamepass-widget'
import './menu-aside.scss'
import LinkProfile from './client/link-profile'
import { useTranslations } from 'next-intl' 

interface IProps{
    auth: CookieValueTypes | undefined
}

export default function MenuAside({auth}: IProps) {
    const t = useTranslations('navbar.asideMenu');
    
    return (
        <div id={auth ? 'pop-up-menu' : 'pop-up-config'}>
            <div>
                <ul className={auth ? 'logged' : 'not-logged'}>
                    {auth && (
                        <>
                            <li><NavLink href='/home'>{t('home')}</NavLink></li>
                            <li><NavLink href='/explore'>{t('explore')}</NavLink></li>
                            <GamepassWidget /> 
                            <li><NavLink href='/create/quiz'>{t('createQuiz')}</NavLink></li>
                            <li><NavLink href='/about-us'>{t('about')}</NavLink></li>
                            <li><LinkProfile/></li>
                            <li><NavLink href={`/saves`}>{t('saves')}</NavLink></li>
                            <li><NavLink href={`/drafts`}>{t('drafts')}</NavLink></li>
                            <li><NavLink href='/profile/config'>{t('config')}</NavLink></li>
                        </>
                    )}
                    <ThemeWidget />
                    <LangsWidget />
                </ul>
            </div>
        </div>
    )
}