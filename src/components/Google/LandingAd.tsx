'use client'
import { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import GoogleAd from './GoogleAd'
import { AD_SLOTS } from './adSlots'
import styles from './landing-ad.module.scss'

// Faixa abaixo dos botões do topo da landing: no desktop, horizontal fina e longa; no
// celular, o formato responsivo. Só monta depois de saber a largura (um pedido de anúncio só).
export default function LandingAd() {
    const isDesktop = useMediaQuery({ minWidth: 768 })
    const [client, setClient] = useState(false)

    useEffect(() => setClient(true), [])

    return (
        <aside className={styles.landing_ad}>
            {client && (isDesktop
                ? <GoogleAd slot={AD_SLOTS.landing} format='horizontal' fullWidth={false} />
                : <GoogleAd slot={AD_SLOTS.landing} format='auto' />)}
        </aside>
    )
}
