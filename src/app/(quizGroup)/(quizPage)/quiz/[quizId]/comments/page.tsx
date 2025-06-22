import UserProfileImgRender from '@/components/ImagesRender/user-profile-img-render'
import React from 'react'
import styles from './comments.module.scss'
import { IUser } from '@/interfaces/IUser'
import { CookieValueTypes } from 'cookies-next'
import { env } from '@/env'
import { getCookie } from 'cookies-next/server'
import { cookies } from 'next/headers'
import FormComponent from '@/components/Comment/form-component'
import IComment from '@/interfaces/IComment'

interface IProps {
    params: {
        quizId: string
    }
}

async function getUser(token:CookieValueTypes) : Promise<IUser | undefined>{
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/user`, {
            method: 'GET',
            headers:{
                'Authorization': `${token}`
            }
        });

        const res = await response.json();
        return res.user;
    } catch (err) {
        console.log(err)
    }   
}
async function getComments(quizId: string) : Promise<IComment[] | undefined>{
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/comments/${quizId}`, {
            method: 'GET'
        });

        const res = await response.json();
        return res.commentsMargedArray;
    } catch (err) {
        console.log(err)
    }   
}

export default async function Comment({params}: IProps) {
    const {quizId} = await params,
        token = await getCookie('token', {cookies}),
        [user, comments] = await Promise.all([
            getUser(token),
            getComments(quizId)
        ])


    return (
        <div className={styles.comment_area}>
            <p>{comments?.length} Comments</p>

            {user && <FormComponent
                styles={styles}
                user={user}
            />}

            {!comments || comments.length === 0 && (<p className={styles.no_comment}>No comments</p>)}

            {comments && comments.length > 0 && <div className={styles.comments}>
                {/* {comments?.map((com, index)=>(
                    <CommentComp 
                        key={com._doc.commentId} 
                        commentUser={com} 
                        index={index} 
                        handleImagesError={handleImagesError} 
                        imagesExist={imagesExist} 
                        user={user} 
                        token={cookie} 
                        quizId={quizId} 
                        repliesLength={repliesLength} 
                        handleRepliesLength={handleRepliesLength} />
                ))} */}
            </div>}
        </div>
    )
}
