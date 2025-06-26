'use client'
import IComment from '@/interfaces/IComment'
import IReplies from '@/interfaces/IReplies'
import { TStyles } from '@/types/stylesType'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

interface IProps{
    styles: TStyles,
    comment: IComment | IReplies,
    isReply?: boolean
}

export default function TextComment({styles, comment, isReply}: IProps) {
    const [exceededContent, setExceededContent] = useState<boolean>(false),
        [showMore, setShowMore] = useState<boolean>(false),

        pElement = useRef<HTMLParagraphElement>(null)


    useEffect(()=>{
        if (pElement.current && pElement.current.offsetHeight > 120) {
            setExceededContent(true)
        }else{
            setExceededContent(false)
        }
    },[pElement])

    return (
        <>
            <div 
                className={showMore 
                        ? `${styles.p_container} ${styles.showing}` 
                        : `${styles.p_container}`
                    }
            >
                <p suppressHydrationWarning ref={pElement}>
                    {isReply && 'userRepliedDates' in comment && comment.userRepliedDates?.name
                        ? <Link href={`/user/${comment.userRepliedDates.userId}`}>@{comment.userRepliedDates.name}</Link>
                        : ''
                    }
                    {comment.body}
                </p>
            </div>
            {exceededContent && <div className={styles.show_more_buttons}>
                {!showMore 
                    ? <button type='button' onClick={e=>setShowMore(true)}>Show more</button>  
                    : <button type='button' onClick={e=>setShowMore(false)}>Show less</button>    
                }   
            </div>}
        </>
    )
}
