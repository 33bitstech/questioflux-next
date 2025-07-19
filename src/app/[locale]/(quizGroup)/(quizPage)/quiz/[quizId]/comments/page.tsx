import React from 'react'
import styles from './comments.module.scss'
import { IUser } from '@/interfaces/IUser'
import { CookieValueTypes } from 'cookies-next'
import { env } from '@/env'
import { getCookie } from 'cookies-next/server'
import { cookies } from 'next/headers'
import CommentFormComponent from '@/components/Comment/comment-form-component'
import IComment from '@/interfaces/IComment'
import CommentContainer from '@/components/Comment/comment-container'
import { getTranslations } from 'next-intl/server' // Importar

// Adicionar locale aos IProps
interface IProps {
    params: Promise<{
        quizId: string,
        locale: string,
    }>
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
    // Receber locale e buscar traduções
    const {quizId, locale} = await params;
    const t = await getTranslations({ locale, namespace: 'commentsSection' });
    const token = await getCookie('token', {cookies});
    const [user, comments] = await Promise.all([
        getUser(token),
        getComments(quizId)
    ]);

    const isCommentsEmpty = !comments || comments.length === 0

    return (
        <div className={styles.comment_area}>
            {/* Usar a tradução com pluralização */}
            <p>{t('title', {count: comments?.length || 0})}</p>

            {user && <CommentFormComponent
                styles={styles}
                user={user}
                quizId={quizId}
                token={token}
            />}

            {isCommentsEmpty && user && (<p className={styles.no_comment}>{t('noComments')}</p>)}
            {isCommentsEmpty && !user && (<p className={styles.no_comment}>{t('noCommentsNoUser')}</p>)}

            {!isCommentsEmpty && <div className={styles.comments}>
                {comments?.map((com, index)=>(
                    <div key={index}>
                        {com && <CommentContainer
                            comment={com}
                            quizId={quizId}   
                            locale={locale}   
                        />}
                    </div>
                ))}
            </div>}
        </div>
    )
}