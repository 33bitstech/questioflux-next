'use client'
import { replyComment } from '@/app/(quizGroup)/(quizPage)/quiz/[quizId]/comments/actions'
import Send from '@/components/Icons/Comment/Send'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import IComment from '@/interfaces/IComment'
import IReplies from '@/interfaces/IReplies'
import { TStyles } from '@/types/stylesType'
import React, { FormEvent, TextareaHTMLAttributes, useState } from 'react'

interface IProps{
    styles: TStyles,
    resetReplying: ()=>void,
    commentOrReply: IComment | IReplies,
    isReply?: boolean,
    token: string | undefined,
    quizId: string
}

export default function ReplyForm({styles, resetReplying, commentOrReply, token, isReply, quizId}:IProps) {
    const [replyValue, setReplyValue] = useState<string>(''),
        [loadingReply, setLoadingReply] = useState<boolean>(false),
        {setError} = useGlobalMessage()

    const handleSubmitReply = async(e:FormEvent)=>{
        e.preventDefault()
        setLoadingReply(true)
        if(replyValue.length > 2000) setError('The maximum number of characters is 2000!')
        const data = {
            comment:{body:replyValue}, 
            replyTo:commentOrReply.userId
        }
        replyComment(quizId, commentOrReply.commentId, data, token)
            .then(res=>{
                if(res?.err) setError(res.err)
            })
            .finally(()=>{
                resetReplying()
                setReplyValue('')
            })
    }

    return (
        <>
            <form onSubmit={handleSubmitReply} className={styles.form_reply}>
                <textarea 
                    value={replyValue} 
                    onChange={e=>setReplyValue(e.target.value)} 
                    autoFocus 
                    maxLength={2000}
                />  
                <button type='submit'><Send/></button>  
            </form>
        </>
    )
}
