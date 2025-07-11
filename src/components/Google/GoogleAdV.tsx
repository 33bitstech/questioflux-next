'use client'
import { env } from '@/env';
import './GoogleAd.scss'

import { Adsense } from '@ctrl/react-adsense';
import { useEffect } from 'react';


declare global {
    interface Window {
        adsbygoogle?: any[];
    }
}

const GoogleAdV = ({left=false, rigth=false}) => {

    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error(err);
        }
    }, []);

    return (<Adsense
        className={`adsbygoogle ${left ? 'left' : ''} ${rigth ? 'rigth' : ''}`}
        client={env.NEXT_PUBLIC_ADSENSE_CLIENT}
        slot={'6584414246'}
        responsive='true'
        format={'vertical'}
    />)
}

export default GoogleAdV