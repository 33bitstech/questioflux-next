'use client'
import { Adsense } from '@ctrl/react-adsense';
import './GoogleAd.scss'

const GoogleAdV = ({left=false, rigth=false}) => {

    return (<Adsense
        className={`adsbygoogle ${left ? 'left' : ''} ${rigth ? 'rigth' : ''}`}
        client='ca-pub-7383504438544213'
        slot={'6584414246'}
        responsive='true'
        format={'vertical'}
    />)
}

export default GoogleAdV