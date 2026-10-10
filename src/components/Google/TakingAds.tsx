'use client'
import { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import GoogleAd from './GoogleAd'
import styles from './taking-ads.module.scss'

// Blocos do AdSense criados para a página de responder (left-taking e right-taking).
const SLOTS = {
    left: '7342265908',
    right: '3447252920',
}

// Mesmo corte da página do quiz: acima de 1270px os anúncios são verticais, fixos nas
// laterais; abaixo, horizontais dentro da página. A altura mínima garante que o vertical
// (160x600) caiba inteiro na tela.
const RAILS_MIN_WIDTH = 1271
const RAILS_MIN_HEIGHT = 640

interface IProps {
    // 'top' = lateral esquerda no desktop / acima da numeração das questões no mobile
    // 'bottom' = lateral direita no desktop / abaixo dos botões de voltar e avançar no mobile
    position: 'top' | 'bottom'
}

export default function TakingAd({ position }: IProps) {
    const hasRoomForRails = useMediaQuery({ minWidth: RAILS_MIN_WIDTH, minHeight: RAILS_MIN_HEIGHT })
    const [canShow, setCanShow] = useState(false)

    useEffect(() => {
        // quiz aberto dentro de um iframe em outro site não leva anúncio
        setCanShow(window.self === window.top)
    }, [])

    if (!canShow) return null

    if (hasRoomForRails) {
        return (
            <aside className={`${styles.rail} ${position === 'top' ? styles.rail_left : styles.rail_right}`}>
                <GoogleAd slot={position === 'top' ? SLOTS.left : SLOTS.right} format='vertical' />
            </aside>
        )
    }

    // O de cima é uma faixa baixa: um bloco alto ali jogaria as questões para fora da tela.
    if (position === 'top') {
        return (
            <aside className={styles.top}>
                <GoogleAd slot={SLOTS.left} fullWidth={false} />
            </aside>
        )
    }

    return (
        <aside className={styles.bottom}>
            <GoogleAd slot={SLOTS.right} />
        </aside>
    )
}
