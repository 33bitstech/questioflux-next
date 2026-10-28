'use client'
import { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import GoogleAd from './GoogleAd'
import { RAILS_MIN_WIDTH, RAILS_MIN_HEIGHT } from './TakingAds'
import { AD_SLOTS } from './adSlots'
import styles from './taking-ads.module.scss'

// Dois anúncios verticais fixos nas laterais, só no desktop, com as mesmas regras da página
// de responder (largura e altura mínimas, lugar reservado, some quando não há anúncio).
// No celular não mostra nada: a página continua só com os anúncios que já tinha.
export default function AdRails() {
    const hasRoomForRails = useMediaQuery({ minWidth: RAILS_MIN_WIDTH, minHeight: RAILS_MIN_HEIGHT })
    const [canShow, setCanShow] = useState(false)

    useEffect(() => {
        // página aberta dentro de um iframe em outro site não leva anúncio
        setCanShow(window.self === window.top)
    }, [])

    if (!canShow || !hasRoomForRails) return null

    return (
        <>
            <aside className={`${styles.rail} ${styles.rail_left}`}>
                <GoogleAd slot={AD_SLOTS.railLeft} format='vertical' />
            </aside>
            <aside className={`${styles.rail} ${styles.rail_right}`}>
                <GoogleAd slot={AD_SLOTS.railRight} format='vertical' />
            </aside>
        </>
    )
}
