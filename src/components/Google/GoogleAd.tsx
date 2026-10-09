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
}

const GoogleAd = ({ slot, format = 'horizontal' }: IProps) => {
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
            responsive='true'
            format={format}
            className={`adsbygoogle`}
        />
    );
}

export default GoogleAd;
