'use client'
import React, { useState } from 'react'

export default function LangsWidget() {
    const [buttonENG, setButtonENG] = useState(true),
            [buttonPTBR, setButtonPTBR] = useState(false)

    const handleENG =()=>{
        if (!buttonENG) {
            setButtonENG(true)
            setButtonPTBR(false)
            let [_, path] = window.location.href.split('.site/')
            window.location.href = `https://www.quizvortex.site/${path}`
        }
    }, 
    handlePTBR=()=>{
        if(!buttonPTBR){
            setButtonPTBR(true)
            setButtonENG(false)

            let [_, path] = window.location.href.split('.site/')
            window.location.href = `https://pt.quizvortex.site/${path}`
        }
    }

    return (
        <li id='langs'>
            <button onClick={handlePTBR} className={buttonPTBR ? 'active' : ''}>
                PTBR
            </button>
            <button onClick={handleENG} className={buttonENG ? 'active' : ''}>
                EN
            </button>
        </li>
    )
}
