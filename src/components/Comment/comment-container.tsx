import Link from 'next/link'
import React from 'react'
import styles from './comment-container.module.scss'
import IComment from '@/interfaces/IComment'
import UserProfileImgRender from '../ImagesRender/user-profile-img-render'
import { getTimeSinceDate } from '@/utils/FormatTime'
import CommentBody from './comment-body'

interface IProps {
    quizId: string,
    comment: IComment
}

export default async function CommentContainer({quizId, comment}:IProps) {
    const {displayText, isoDate} = getTimeSinceDate(comment.created_at)
    
    return (
        <div className={`${styles.comment}`}>
            <Link href={`/user/${comment.userId}`} className={styles.image_comment_container}>
                <UserProfileImgRender user={comment} />
            </Link>
            <div className={styles.body_comment}>
                <div className={styles.header_comment}>
                    <Link href={`/user/${comment.userId}`}>{comment?.name}</Link>
                    <time suppressHydrationWarning dateTime={isoDate}>{displayText}</time>
                </div>
                <CommentBody
                    comment={comment}
                    styles={styles}
                    quizId={quizId}
                />
            </div>
        </div>
    )
}