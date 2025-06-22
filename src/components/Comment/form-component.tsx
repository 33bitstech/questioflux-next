'use client'
import { TStyles } from '@/types/stylesType'
import React, { FormEvent, useState } from 'react'
import UserProfileImgRender from '../ImagesRender/user-profile-img-render'
import { IUser } from '@/interfaces/IUser'
import Send from '../Icons/Comment/Send'

interface IProps {
    styles: TStyles,
    user: IUser
}

export default function FormComponent({styles, user}: IProps) {
    const [commentValue, setCommentValue] = useState<string>('')

    const handleComment =(e:FormEvent) =>{
        e.preventDefault()
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
                    <button><Send/></button>
                </div>
            </div>
        </form>
    )
}
