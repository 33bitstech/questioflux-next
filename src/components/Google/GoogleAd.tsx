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

const GoogleAd = () => {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error(err);
        }
    }, []);


    return (
        <Adsense
            client='ca-pub-7383504438544213'
            slot='6282931841' 
            responsive='true'
            format={'horizontal'}
            className={`adsbygoogle`}
        />
    );
}

export default GoogleAd;