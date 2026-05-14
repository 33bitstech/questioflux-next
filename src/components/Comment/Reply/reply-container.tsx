'use client'
import UserProfileImgRender from '@/components/ImagesRender/user-profile-img-render'
import IReplies from '@/interfaces/IReplies'
import { TStyles } from '@/types/stylesType'
import { getTimeSinceDate } from '@/utils/FormatTime'
import {Link} from '@/i18n/navigation'
import React from 'react'
import ReplyBody from './reply-body'
import { useLocale } from 'next-intl'

interface IProps{
    styles: TStyles
    reply: IReplies
    quizId: string
    commentId: string
}

export default function ReplyContainer({reply, styles, quizId, commentId}:IProps) {
    const locale = useLocale()
    const {displayText, isoDate} = getTimeSinceDate(reply.created_at, locale)
    
    return (
        <div className={`${styles.comment}`}>
            <Link locale={locale} href={`/user/${reply.userId}`} className={styles.image_comment_container}>
                <UserProfileImgRender user={reply} />
            </Link>
            <div className={styles.body_comment}>
                <div className={styles.header_comment}>
                    <Link locale={locale} href={`/user/${reply.userId}`}>{reply?.name}</Link>
                    <time suppressHydrationWarning dateTime={isoDate}>{displayText}</time>
                </div>
                <ReplyBody
                    reply={reply}
                    styles={styles}
                    quizId={quizId}
                    commentId={commentId}
                />
            </div>
        </div>
    )
}
