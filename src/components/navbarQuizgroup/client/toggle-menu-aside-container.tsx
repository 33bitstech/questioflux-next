'use client'
import CloseSvg from '@/components/Icons/CloseSvg'
import MenuSvg from '@/components/Icons/MenuSvg'
import React, { useState } from 'react'
import MenuAside from '../menu-aside'
import { CookieValueTypes } from 'cookies-next'
import Overlay from './overlay'
import ConfigSvg from '@/components/Icons/ConfigSvg'

interface IProps{
    styles: Record<string, string>,
    token?: CookieValueTypes | undefined,
    className: string
}

export default function ToggleMenuAsideContainer({styles, token, className} : IProps) {
    const [menuOpen, setMenuOpen] = useState<boolean>(false)
    return (
        <>
            <li className={styles[className]}>
                <span onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen 
                        ? <CloseSvg /> 
                        : className == 'config_container' 
                            ? <ConfigSvg/>
                            : <MenuSvg/>
                    }
                </span>
                {menuOpen && <MenuAside auth={token}/>}
            </li> 
            {menuOpen && <Overlay styles={styles} setMenuOpen={setMenuOpen} />}
        </>
    )
}
