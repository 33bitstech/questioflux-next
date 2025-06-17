import NavLink from '@/components/widgets/NavLink'
import { CookieValueTypes } from 'cookies-next'
import React, { useState } from 'react'
import LangsWidget from './client/langs-widget'
import ThemeWidget from './client/theme-widget'
import GamepassWidget from './client/gamepass-widget'

import './menu-aside.scss'

interface IProps{
    auth: CookieValueTypes | undefined
}

export default function MenuAside({auth}: IProps) {
    
    return (
        <div id={auth ? 'pop-up-menu' : 'pop-up-config'}>
            <div>
                <ul className={auth ? 'logged' : 'not-logged'}>
                    {auth && (
                        <>
                            <li>
                                <NavLink href='/home'>Home</NavLink>
                            </li>
                            <li>
                                <NavLink href='/explore'>Explore</NavLink>
                            </li>
                            <GamepassWidget />
                            <li>
                                <NavLink href='/create/quiz'>Create Quiz</NavLink>
                            </li>
                            <li>
                                <NavLink href={`/user/123`}>Profile</NavLink>
                            </li>
                            <li>
                                <NavLink href={`/saves`}>Saves</NavLink>
                            </li>
                            <li>
                                <NavLink href={`/drafts`}>Drafts</NavLink>
                            </li>
                            <li>
                                <NavLink href='/profile/config'>Config</NavLink>
                            </li>
                        </>
                    )}
                    <ThemeWidget />
                    <LangsWidget />
                </ul>
            </div>
        </div>
    )
}
