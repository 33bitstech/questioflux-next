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

const GoogleAdV = ({left=false, rigth=false, slot}: {left: boolean, rigth: boolean, slot:string}) => {

    /* useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error(err);
        }
    }, []); */

    return (<Adsense
        className={`adsbygoogle ${left ? 'left' : ''} ${rigth ? 'rigth' : ''}`}
        client='ca-pub-7383504438544213'
        slot={slot}
        responsive='true'
        format={'vertical'}
    />)
}

export default GoogleAdV