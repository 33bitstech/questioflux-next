'use client'
import { Adsense } from '@ctrl/react-adsense';
import './GoogleAd.scss'
import Script from 'next/script';

const GoogleAdV = ({left=false, rigth=false}) => {

    return (<Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7383504438544213`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
        slot='6282931841'
        className={`adsbygoogle ${left ? 'left' : ''} ${rigth ? 'rigth' : ''}`}
    />)

    /* return (<Adsense
        className={`adsbygoogle ${left ? 'left' : ''} ${rigth ? 'rigth' : ''}`}
        client='ca-pub-7383504438544213'
        slot={'6584414246'}
        responsive='true'
        format={'vertical'}
    />) */
}

export default GoogleAdV