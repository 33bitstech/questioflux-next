'use client'
import { Adsense } from '@ctrl/react-adsense';
import './GoogleAd.scss'

const GoogleAd = ({}) => {
    return (<Adsense
        className={`adsbygoogle`}
        client='ca-pub-7383504438544213'
        slot={'6282931841'}
        responsive='true'
        format={'horizontal'}
    />)
}

export default GoogleAd