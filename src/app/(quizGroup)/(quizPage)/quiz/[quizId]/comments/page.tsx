import UserProfileImgRender from '@/components/ImagesRender/user-profile-img-render'
import React from 'react'
import styles from './comments.module.scss'

interface IProps {
    params: {
        quizId: string
    }
}

export default async function Comment({params}: IProps) {
    const {quizId} = await params

    return <p>Comments: {quizId}</p>
    /* return (
        <div className={styles.comment_area}>
            <p>{comments?.length} Comments</p>

            <form onSubmit={handleComment}>
                <div className={styles.profile_image_comment}>
                    <UserProfileImgRender />
                </div>
                <div className={styles.commenting}>
                    <label htmlFor="comment">Comment as <span>@{user?.name}</span></label>
                    <div className={styles.input_container}>
                        <input type="text" id='comment' placeholder='Write your comment' value={commentValue} onChange={e=>setCommentValue(e.target.value)} max={2000} />
                        <button><Send/></button>
                    </div>
                </div>
            </form>

            <div className={styles.comments}>
                {comments?.map((com, index)=>(
                    <CommentComp key={com._doc.commentId} commentUser={com} index={index} handleImagesError={handleImagesError} imagesExist={imagesExist} user={user} token={cookie} quizId={quizId} repliesLength={repliesLength} handleRepliesLength={handleRepliesLength} />
                ))}
            </div>
        </div>
    ) */
}
