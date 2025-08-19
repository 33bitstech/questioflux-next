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

const GoogleAd = ({slot}: {slot: string}) => {
    /* useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error(err);
        }
    }, []); */

    return null
    /* return (
        <Adsense
            client={'ca-pub-7383504438544213'}
            slot={slot} 
            responsive='true'
            format={'horizontal'}
            className={`adsbygoogle`}
        />
    ); */
}

export default GoogleAd;