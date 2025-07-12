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
import LogoutWidget from './client/logout-widget'
import { useMediaQuery } from 'react-responsive'

interface IProps{
    auth: CookieValueTypes | undefined
}

export default function MenuAside({auth}: IProps) {
    const t = useTranslations('navbar');
    const isMobile = useMediaQuery({ maxWidth: 860 });

    return (
        <div id={auth ? 'pop-up-menu' : 'pop-up-config'}>
            <div>
                <ul className={auth ? 'logged' : 'not-logged'}>
                    {auth && (
                        <>
                            <li><NavLink href='/home'>{t('asideMenu.home')}</NavLink></li>
                            <li><NavLink href='/explore'>{t('asideMenu.explore')}</NavLink></li>
                            <GamepassWidget /> 
                            <li><NavLink href='/create/quiz'>{t('asideMenu.createQuiz')}</NavLink></li>
                            <li><NavLink href='/about-us'>{t('asideMenu.about')}</NavLink></li>
                            <li><LinkProfile/></li>
                            <li><NavLink href={`/saves`}>{t('asideMenu.saves')}</NavLink></li>
                            <li><NavLink href={`/drafts`}>{t('asideMenu.drafts')}</NavLink></li>
                            <li><NavLink href='/profile/config'>{t('asideMenu.config')}</NavLink></li>

                            {isMobile && 
                                <li className='leave'>
                                    <LogoutWidget text={t('logout')} />
                                </li>
                            }
                        </>
                    )}
                    <ThemeWidget />
                    <LangsWidget />
                </ul>
            </div>
        </div>
    )
}