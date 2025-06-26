'use client'
import { TStyles } from '@/types/stylesType'
import React, { FormEvent, useState } from 'react'
import UserProfileImgRender from '../ImagesRender/user-profile-img-render'
import { IUser } from '@/interfaces/IUser'
import Send from '../Icons/Comment/Send'
import { useGlobalMessage } from '@/contexts/globalMessageContext'
import { CookieValueTypes } from 'cookies-next'
import { createComment } from '@/app/(quizGroup)/(quizPage)/quiz/[quizId]/comments/actions'

interface IProps {
    styles: TStyles,
    user: IUser,
    quizId: string,
    token: CookieValueTypes
}

export default function CommentFormComponent({styles, user, quizId, token}: IProps) {
    const [commentValue, setCommentValue] = useState<string>(''),
        {setError} = useGlobalMessage(),
        [loading, setLoading] = useState<boolean>(false)

    const handleComment =async(e:FormEvent) =>{
        setLoading(true)
        e.preventDefault()
        if (commentValue) {
            if(commentValue.length > 2000) return setError('The maximum number of characters is 2000!') 
            const data = {
                comment: {
                    body:commentValue,
                    quizId
                }
            }
            await createComment(quizId, data, token).then(res=>{
                if(res?.err) setError(res.err)
            })
        }

        setCommentValue('')
        setLoading(false)
    }
    return (
        <form onSubmit={handleComment}>
            <div className={styles.profile_image_comment}>
                <UserProfileImgRender 
                    user={user}
                />
            </div>
            <div className={styles.commenting}>
                <label htmlFor="comment">Comment as <span>@{user?.name}</span></label>
                <div className={styles.input_container}>
                    <textarea 
                        id='comment' 
                        placeholder='Write your comment' 
                        value={commentValue} 
                        onChange={e=>setCommentValue(e.target.value)} 
                        maxLength={2000}
                    />
                    <button disabled={loading}><Send/></button>
                </div>
            </div>
        </form>
    )
}
