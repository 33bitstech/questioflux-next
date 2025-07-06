import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { useUser } from '@/contexts/userContext'
import IReplies from '@/interfaces/IReplies'
import { TStyles } from '@/types/stylesType'
import React, { FormEvent, useState } from 'react'
import TextComment from '../excerpts-comments/text-comment'
import EditForm from '../excerpts-comments/edit-form'
import ActionsComment from '../excerpts-comments/actions-comment'
import ReplyForm from '../excerpts-comments/reply-form'
import { deleteReply, dislikeReply, editReply, likeReply } from '@/app/[locale]/(quizGroup)/(quizPage)/quiz/[quizId]/comments/actions'
import { useRouter } from '@/i18n/navigation'

interface IProps{
    styles: TStyles
    reply: IReplies
    quizId: string
    commentId: string
}

export default function ReplyBody({quizId, reply, styles, commentId}: IProps) {
    const {user, token} = useUser(),
            {setError} = useGlobalMessage(),
            router = useRouter()
    
        const arrayLikes = reply.userLikes

        const [editing, setEditing] = useState<boolean>(false),
            [replying, setReplying] = useState<boolean>(false), 
            [liked, setLiked] = useState<boolean>(false),
            [likeCount, setLikeCount] = useState(arrayLikes?.length),
    
    
            [replyValueEdited, setReplyValueEdited] = useState<string>(''),
        
            [loadingEdit, setLoadingEdit] = useState<boolean>(false)

        const handleEdit = ()=>{
            setEditing(!editing)
            setReplyValueEdited(reply.body)
        },
        handleReply = () =>{
            setReplying(state=>!state)
        },
        handleRemove = ()=>{
            const data = {comment:reply.body}
            deleteReply(quizId, commentId, reply.replyId, data, token).then(res=>{
                if(res?.err) setError(res.err)
                else router.refresh()
            })
        },
        handleSubmitEdit = (e:FormEvent)=>{
            setLoadingEdit(true)
            e.preventDefault()
    
            if(!replyValueEdited) return
            if (replyValueEdited.length > 2000) return setError('The maximum number of characters is 2000!')
            const data = {
                reply: {...reply, body:replyValueEdited, quizId},
            }
            editReply(quizId, commentId, reply.replyId, data, token).then(res=>{
                if(res?.err) setError(res.err)
            }).finally(()=>{
                setEditing(false)
                setLoadingEdit(false)
                router.refresh()
            })
        },
        handleLikeComment = () =>{
            if(!user) return
            if (liked){
                setLiked(false)
                setLikeCount(state => (state ?? 0) - 1)
                dislikeReply(commentId, reply.replyId, token).then(res=>{
                    if(res?.err) setError(res.err)
                })
            } else{
                setLiked(true)
                setLikeCount(state=> (state ?? 0) + 1)
                likeReply(commentId, reply.replyId, token).then(res=>{
                    if(res?.err) setError(res.err)
                })
            }
        }

    return (
        <>
            <div className={styles.content_comment}>
                {!editing && 
                    <TextComment
                        comment={reply}
                        isReply={true}
                        styles={styles}
                    />
                }
                {editing && 
                    <EditForm
                        placeholder={replyValueEdited} 
                        value={replyValueEdited} 
                        onChange={e=>setReplyValueEdited(e.target.value)}
                        styles={styles}
                        handleEdit={handleEdit}
                        loadingEdit={loadingEdit}
                        handleSubmitEdit={handleSubmitEdit}
                    />
                }
            </div>
            <div className={styles.actions_comment}>
                <ActionsComment
                    commentOrReply={reply}
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
            {replying && <>
                <div className={styles.dynamic_itens}>
                    <ReplyForm
                        commentId={commentId}
                        commentOrReply={reply}
                        quizId={quizId}
                        resetReplying={()=>setReplying(false)}
                        styles={styles}
                        token={token}
                    />
                </div>
            </>}
        </>
    )
}
