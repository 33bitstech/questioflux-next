'use client'
import { useUser } from '@/contexts/userContext'
import IComment from '@/interfaces/IComment'
import { TStyles } from '@/types/stylesType'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import IReplies from '@/interfaces/IReplies'
import { deleteComment, dislikeComment, editComment, likeComment, repliesFromComment } from '@/app/[locale]/(quizGroup)/(quizPage)/quiz/[quizId]/comments/actions'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import TextComment from './excerpts-comments/text-comment'
import EditForm from './excerpts-comments/edit-form'
import ActionsComment from './excerpts-comments/actions-comment'
import ReplyForm from './excerpts-comments/reply-form'
import ArrowSvg from '../Icons/ArrowSvg'
import ReplyContainer from './Reply/reply-container'
import { useTranslations } from 'next-intl';

interface IProps{
    styles: TStyles,
    comment: IComment,
    quizId: string
}

export default function CommentBody({styles, comment, quizId}:IProps) {
    const {user, token} = useUser(),
        {setError} = useGlobalMessage()

    const t = useTranslations('commentsSection');

    const arrayLikes = comment.userLikes,
        arrayReplies = comment.replies

    const [editing, setEditing] = useState<boolean>(false),
        [replying, setReplying] = useState<boolean>(false), 
        [showReplies, setShowReplies] = useState(false),
        [liked, setLiked] = useState<boolean>(false),
        [likeCount, setLikeCount] = useState(arrayLikes?.length),


        [commentValueEdited, setCommentValueEdited] = useState<string>(''),

        [replies, setReplies] = useState<IReplies[]>(),

        [loadingEdit, setLoadingEdit] = useState<boolean>(false)

    const handleEdit = ()=>{
        setEditing(!editing)
        setCommentValueEdited(comment.body)
    },
    handleReply = () =>{
        setReplying(state=>!state)
    },
    handleShowReplies = ()=>{
        setShowReplies(state=>!state)
    },
    handleRemove = ()=>{
        const data = {comment:comment.body}
        deleteComment(quizId, comment.commentId, data, token).then(res=>{
            if(res?.err) setError(res.err)
        })
    },
    handleSubmitEdit = (e:FormEvent)=>{
        setLoadingEdit(true)
        e.preventDefault()

        if(!commentValueEdited) return
        if (commentValueEdited.length > 2000) return setError(t('form.errors.maxLength'))
        const data = {
            comment: {body:commentValueEdited, quizId, commentId:comment.commentId},
        }
        editComment(quizId, comment.commentId, data, token).then(res=>{
            if(res?.err) setError(res.err)
        }).finally(()=>{
            setEditing(false)
            setLoadingEdit(false)
        })
    },
    handleLikeComment = () =>{
        if(!user) return
        if (liked){
            setLiked(false)
            setLikeCount(state => (state ?? 0) - 1)
            dislikeComment(comment.commentId, token).then(res=>{
                if(res?.err) setError(res.err)
            })
        } else{
            setLiked(true)
            setLikeCount(state=> (state ?? 0) + 1)
            likeComment(comment.commentId, token).then(res=>{
                if(res?.err) setError(res.err)
            })
        }
    }

    useEffect(()=>{
        const get = async()=>{
            const res = await repliesFromComment(quizId, comment.commentId)
            if(res) setReplies(res)
        }
        get()
    },[arrayReplies])

    return (
        <>
            <div className={styles.content_comment}>
                {!editing && 
                    <TextComment
                        comment={comment}
                        styles={styles}
                    />
                }
                {editing && 
                    <EditForm
                        placeholder={commentValueEdited} 
                        value={commentValueEdited} 
                        onChange={e=>setCommentValueEdited(e.target.value)}
                        styles={styles}
                        handleEdit={handleEdit}
                        loadingEdit={loadingEdit}
                        handleSubmitEdit={handleSubmitEdit}
                    />
                }
            </div>
            <div className={styles.actions_comment}>
                <ActionsComment
                    commentOrReply={comment}
                    handleEdit={handleEdit}
                    handleRemove={handleRemove}
                    handleReply={handleReply}
                    likeCount={likeCount}
                    styles={styles}
                    toggleLike={handleLikeComment}
                    token={token}
                    user={user}
                    liked={liked}
                    setLiked={setLiked}
                />
            </div>
            {(replying || arrayReplies && arrayReplies.length > 0 || showReplies || replies) && <>
                <div className={styles.dynamic_itens}>
                    {replying && 
                        <ReplyForm
                            commentOrReply={comment}
                            quizId={quizId}
                            resetReplying={()=>setReplying(false)}
                            styles={styles}
                            token={token}
                            commentId={comment.commentId}
                        />
                    }

                    {(arrayReplies && arrayReplies.length > 0 || replies && replies.length > 0) && <>
                        
                        <span className={`${styles.show_more} ${showReplies ? styles.show_active : ''}`} onClick={handleShowReplies}>
                            <p>
                                {/* Usar tradução com pluralização para as respostas */}
                                {t('body.showReplies', {count: replies ? replies.length : arrayReplies ? arrayReplies.length : 0})}
                            </p>
                            <ArrowSvg/>
                        </span>

                        {showReplies && <div className={styles.replies}>
                            {replies?.map((rep, i, reps)=>(
                                <ReplyContainer
                                    key={i}
                                    quizId={quizId}
                                    reply={rep}
                                    styles={styles}
                                    commentId={comment.commentId}
                                />
                            ))}
                        </div>}
                    </>}
                </div>
            </>}
        </>
    )
}
