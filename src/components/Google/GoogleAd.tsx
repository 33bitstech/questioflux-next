'use client'
import { Adsense } from '@ctrl/react-adsense';
import './GoogleAd.scss'
import Script from 'next/script';

const GoogleAd = ({}) => {

    return (<Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7383504438544213`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
        slot='6282931841'
        className='adsbygoogle'
    />)
    /* return (<Adsense
        className={`adsbygoogle`}
        client='ca-pub-7383504438544213'
        slot={'6282931841'}
        responsive='true'
        format={'horizontal'}
    />) */
}

export default GoogleAd