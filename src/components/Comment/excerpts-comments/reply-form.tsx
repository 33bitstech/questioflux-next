'use client'
import { replyComment } from '@/app/(quizGroup)/(quizPage)/quiz/[quizId]/comments/actions'
import Send from '@/components/Icons/Comment/Send'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import IComment from '@/interfaces/IComment'
import IReplies from '@/interfaces/IReplies'
import { TStyles } from '@/types/stylesType'
import { useRouter } from 'next/navigation'
import React, { FormEvent, TextareaHTMLAttributes, useState } from 'react'

interface IProps{
    styles: TStyles,
    resetReplying: ()=>void,
    commentOrReply: IComment | IReplies,
    isReply?: boolean,
    token: string | undefined,
    quizId: string,
    commentId: string
}

export default function ReplyForm({styles, resetReplying, commentOrReply, token, commentId, quizId}:IProps) {
    const [replyValue, setReplyValue] = useState<string>(''),
        [loadingReply, setLoadingReply] = useState<boolean>(false),
        {setError} = useGlobalMessage(),
        router = useRouter()

    const handleSubmitReply = async(e:FormEvent)=>{
        e.preventDefault()
        setLoadingReply(true)
        if(replyValue.length > 2000) {
            setError('The maximum number of characters is 2000!')
            setLoadingReply(false)
        }
        const data = {
            comment:{body:replyValue}, 
            replyTo:commentOrReply.userId
        }
        replyComment(quizId, commentId, data, token)
            .then(res=>{
                if(res?.err) setError(res.err)
                else router.refresh()
            })
            .finally(()=>{
                resetReplying()
                setReplyValue('')
                setLoadingReply(false)
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
                <button type='submit' disabled={loadingReply}><Send/></button>  
            </form>
        </>
    )
}
