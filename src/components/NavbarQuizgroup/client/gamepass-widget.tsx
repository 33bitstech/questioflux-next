'use client'
import React, { useState } from 'react'
import VortexPlus from '../signatures/VortexPlus'
import VortexPlusUniqueUse from '../signatures/VortexPlusUniqueUse'

export default function GamepassWidget() {
    const [openVortexPlus, setOpenVortexPlus] = useState(false)
    
    return (
        <li id="link">
            <button
                onClick={() => setOpenVortexPlus(!openVortexPlus)}
                className={openVortexPlus ? 'active' : ''}
            >
                VortexPlus
            </button>
            {openVortexPlus && (
                <div className='gamepass-vortexplus'>
                    <VortexPlus/>
                    <VortexPlusUniqueUse/>
                </div>
            )}
        </li>
    )
}
