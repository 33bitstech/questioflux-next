'use client'

import CloseSvg from '@/components/Icons/CloseSvg'
import React from 'react'

interface IProps{
    show_pop_up: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ClosePopupAuth({show_pop_up, ...props}: IProps) {
    return (
        <span className='closepopup' {...props} onClick={()=>show_pop_up(false)}><CloseSvg/></span>
    )
}
