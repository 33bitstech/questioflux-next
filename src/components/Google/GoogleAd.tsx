'use client'

import { Adsense } from '@ctrl/react-adsense';
import { useEffect } from 'react';

import './GoogleAd.scss'
import { env } from '@/env';

declare global {
    interface Window {
        adsbygoogle?: any[];
    }
}

interface IProps {
    slot: string
    format?: 'horizontal' | 'vertical' | 'rectangle' | 'auto'
    // true (padrão): no celular o anúncio ocupa a largura toda da tela e o Google pode
    // servir um bloco alto, quase quadrado. false: fica do tamanho do container, em faixa.
    fullWidth?: boolean
}

const GoogleAd = ({ slot, format = 'horizontal', fullWidth = true }: IProps) => {
    /* useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error(err);
        }
    }, []); */


    return (
        <Adsense
            client={'ca-pub-7383504438544213'}
            slot={slot}
            responsive={fullWidth ? 'true' : 'false'}
            format={format}
            className={`adsbygoogle`}
        />
    );
}

export default GoogleAd;
