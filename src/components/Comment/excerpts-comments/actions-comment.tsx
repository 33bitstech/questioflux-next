'use client'
import { deleteComment, dislikeComment, likeComment } from '@/app/[locale]/(quizGroup)/(quizPage)/quiz/[quizId]/comments/actions'
import ArrowSvg from '@/components/Icons/ArrowSvg'
import Like from '@/components/Icons/Comment/Like'
import MoreIcon from '@/components/Icons/Comment/MoreIcon'
import Reply from '@/components/Icons/Comment/Reply'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import IComment from '@/interfaces/IComment'
import IReplies from '@/interfaces/IReplies'
import { IUser } from '@/interfaces/IUser'
import { useTranslations } from 'next-intl';
import { TStyles } from '@/types/stylesType'
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'

interface IProps {
    styles: TStyles,
    token: string | undefined,
    likeCount: number | undefined
    handleReply: ()=> void
    toggleLike: ()=>void
    handleRemove: () => void
    handleEdit: ()=>void
    commentOrReply: IComment | IReplies,
    user: IUser | null,
    liked: boolean,
    setLiked: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ActionsComment({
    styles, 
    token, 
    commentOrReply, 
    user,
    handleRemove,
    handleReply,
    handleEdit,
    likeCount,
    toggleLike,
    liked,
    setLiked
}: IProps) {
    const [isClient, setIsClient] = useState<boolean>(false),
        arrayLikes = commentOrReply.userLikes,
        [openOptions, setOpenOptions] = useState<boolean>(false),       

        {theme} = useTheme()
    const t = useTranslations('commentsSection.actions');
    const handleOptions = ()=>{
        setOpenOptions(!openOptions)
    },
    verifyUserLike = ()=>{
        if(!user) return false
        if(arrayLikes) return arrayLikes.some(like=> like.userId == user.userId)
        return false
    },
    verifyCommentUser = ()=>{
        if(!user) return false
        return commentOrReply.userId == user.userId
    }

    useEffect(()=>{
        setIsClient(true)
    },[])
    useEffect(()=>{
        if(commentOrReply) setLiked(verifyUserLike())
    },[commentOrReply, user])

    return (
        <>
            {isClient && token && 
                <div className={styles.action} onClick={handleReply}>
                    <Reply />
                    <p>{t('reply')}</p>
                </div>
            }
            <div className={styles.action} onClick={toggleLike}>
                {isClient && <Like active={liked} theme={theme}/>}
                <p>{likeCount}</p>
            </div>
            {isClient && verifyCommentUser() && <>
                <div className={`${styles.action} ${openOptions ? styles.action_active : ''}`} onClick={handleOptions}>
                    {isClient && <MoreIcon active={openOptions} theme={theme}/> }
                    <p>{t('more')}</p>
                    {openOptions && <>
                        <ul className={styles.options}>
                            <li onClick={handleEdit}><ArrowSvg/> {t('edit')}</li>
                            <li onClick={handleRemove}><ArrowSvg/> {t('remove')}</li>
                        </ul>
                    </>}
                </div>
            </>}
        </>
    )
}
