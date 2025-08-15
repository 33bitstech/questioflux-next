'use client'
import React, { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import GoogleAd from './GoogleAd'
import GoogleAdV from './GoogleAdV'

interface IProps{
    left?:boolean
    right?:boolean
    slot: string
}

export default function GoogleAdMobile({left, right, slot}:IProps) {
    const isMobileAd = useMediaQuery({maxWidth: 1270})
    const [client, setClient] = useState(false)

    useEffect(()=>{
        setClient(true)
    },[])
    return (
        <>
            {client && isMobileAd 
                ? <GoogleAd slot={slot}/> 
                : <GoogleAdV left={!!left} rigth={!!right} slot={slot} />
            }
        </>
    )
}
