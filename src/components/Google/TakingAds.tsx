'use client'
import { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import GoogleAd from './GoogleAd'
import styles from './taking-ads.module.scss'

// Blocos do AdSense da página de responder. Por enquanto reaproveitam os da página de
// informações e de resultados; para medir esta página separado, crie blocos próprios no
// painel do AdSense e troque os ids aqui.
const SLOTS = {
    left: '6584414246',
    right: '2713167869',
    bottom: '8751962602',
}

// Laterais só em tela larga e alta o bastante: o anúncio fica a mais de 150px de
// qualquer botão do quiz (política de posicionamento do AdSense) e cabe inteiro.
const RAILS_MIN_WIDTH = 1500
const RAILS_MIN_HEIGHT = 720

export default function TakingAds() {
    const hasRoomForRails = useMediaQuery({ minWidth: RAILS_MIN_WIDTH, minHeight: RAILS_MIN_HEIGHT })
    const [canShow, setCanShow] = useState(false)

    useEffect(() => {
        // quiz aberto dentro de um iframe em outro site não leva anúncio
        setCanShow(window.self === window.top)
    }, [])

    if (!canShow) return null

    if (hasRoomForRails) {
        return (
            <>
                <aside className={`${styles.rail} ${styles.rail_left}`}>
                    <GoogleAd slot={SLOTS.left} format='vertical' />
                </aside>
                <aside className={`${styles.rail} ${styles.rail_right}`}>
                    <GoogleAd slot={SLOTS.right} format='vertical' />
                </aside>
            </>
        )
    }

    return (
        <aside className={styles.bottom}>
            <GoogleAd slot={SLOTS.bottom} />
        </aside>
    )
}
